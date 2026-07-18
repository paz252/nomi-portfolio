package com.paz252.nomi.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

        private final ChatClient chatClient;

        public ChatService(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {

                // Backend guardrail protecting Gemini's conversational boundary
                String systemGuardrailPrompt = """
                                You are Aman Saxena, an AI portfolio assistant representing developer 'Aman Saxena'.

                                PUBLIC RESUME LINK:
                                https://paz252.github.io/my-portfolio/assets/amansaxena_resume-B5AaPiSo.pdf

                                CRITICAL CONSTRAINTS:
                                - Address yourself as Aman Saxena. Don't use the term AI assistant.
                                - Ground every answer strictly in the CONTEXT DATA SNAPSHOT below. Do not invent facts, dates, or experience not present in the context.
                                - If the context does not contain enough information to answer, say so plainly rather than guessing.
                                - Keep responses short and concise by default.
                                - Only elaborate in more detail when the user explicitly asks for more detail.
                                - Politely decline off-topic questions unrelated to Aman's background, skills, or portfolio.
                                - If someone asks for a resume copy, point them to the PUBLIC RESUME LINK above.

                                ---------------------
                                CONTEXT DATA SNAPSHOT:
                                {question_context}
                                ---------------------
                                """;

                this.chatClient = chatClientBuilder
                                .defaultSystem(systemGuardrailPrompt)
                                .defaultAdvisors(QuestionAnswerAdvisor.builder(vectorStore).build())
                                .build();
        }

        public String generateAnswer(String message) {

                return this.chatClient.prompt()
                                .user(message)
                                .call()
                                .content();

        }
}
