import mongoose, { Schema, model } from "mongoose";

interface IRefundPolicyQuestion {
  userId?: mongoose.Types.ObjectId;
  clerkId: string;
  refundText: string;
  termsText: string;
  refundQuestions?: [
    {
      question: string,
      answer: string,
      keywords: [string]
    }
  ];
  termsQuestion?: [
    {
      question: string,
      answer: string,
      keywords: [string]
    }
  ]
}

const RefundPolicyQuestionSchema = new Schema(
  {
    userId: mongoose.Types.ObjectId,
    clerkId: String,
    refundText: String,
    termsText: String,
    refundQuestions: [
      {
        question: String,
        answer: String,
        keywords: [String]
      }
    ],
    termsQuestion: [
      {
        question: String,
        answer: String,
        keywords: [String]
      }
    ]
  },
  { timestamps: true },
);

const RefundPolicyQuestion = model<IRefundPolicyQuestion>("RefundPolicyQuestion", RefundPolicyQuestionSchema);

export default RefundPolicyQuestion;
