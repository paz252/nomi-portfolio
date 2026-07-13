package com.paz252.nomi.config;

import java.util.List;

import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

/*
The Ingestion Pipeline & Vector Store Configuration
This configuration bean instantiates an in-memory SimpleVectorStore. On application startup, 
it reads deep-dive markdown file (resume-portfolio.md), splits it into semantically clean blocks, 
computes text embeddings using the Gemini Embedding API, and loads them into memory.
*/

@Configuration
public class VectorStoreConfig {

    @Value("${nomi.data.source-path}")
    private Resource markdownResource;

    @Bean
    public SimpleVectorStore vectorStore(EmbeddingModel embeddingModel) {

        // 1. Initialize an in-memory Vector Store
        SimpleVectorStore vectorStore = SimpleVectorStore.builder(embeddingModel).build();

        try {

            // Step 1: Extract text content from our markdown file
            TextReader textReader = new TextReader(markdownResource);
            List<Document> rawDocuments = textReader.get();

            // Step 2: Transform text chunks cleanly into tokens
            TokenTextSplitter textSplitter = TokenTextSplitter.builder()
                                                .withChunkSize(800)
                                                .withMinChunkSizeChars(500)
                                                .withMinChunkLengthToEmbed(10)
                                                .withMaxNumChunks(10000)
                                                .withKeepSeparator(true)
                                                .build();
            List<Document> splitDocuments = textSplitter.apply(rawDocuments);

            // Step 3: Load into SimpleVectorStore (Automatically triggers EmbeddingModel
            // internally)
            System.out.printf("Generating embeddings and writing %d chunks to SimpleVectorStore...",
                    splitDocuments.size());
            vectorStore.add(splitDocuments);
            System.out.println("ETL Ingestion completed successfully. NOMI data is grounded.");

        } catch (Exception e) {
            System.err.println("Failed to complete data ingestion from markdown file!" + e.getMessage());
            throw new IllegalStateException("Vector store ingestion failed — app cannot serve grounded answers", e);
        }

        return vectorStore;
    }
}
