import { db } from "./db";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation = await getConversation(memberOneId, memberTwoId);

  if (!conversation) {
    conversation = await createConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

async function createConversation(memberOneId: string, memberTwoId: string) {
  try {
    const conversation = await db.conversation.create({
      data: {
        conversationInitiaterId: memberOneId,
        conversationReceiverId: memberTwoId,
      },
      include: {
        conversationInitiator: {
          include: {
            profile: true,
          },
        },
        conversationReceiver: {
          include: {
            profile: true,
          },
        },
      },
    });

    return conversation;
  } catch (error) {
    console.error("Something went wrong with createConversation", error);
    return null;
  }
}

async function getConversation(memberOneId: string, memberTwoId: string) {
  try {
    const findConversation = await db.conversation.findFirst({
      where: {
        OR: [
          {
            conversationInitiaterId: memberOneId,
            conversationReceiverId: memberTwoId,
          },
          {
            conversationInitiaterId: memberTwoId,
            conversationReceiverId: memberOneId,
          },
        ],
      },
      include: {
        conversationInitiator: {
          include: {
            profile: true,
          },
        },
        conversationReceiver: {
          include: {
            profile: true,
          },
        },
      },
    });

    return findConversation;
  } catch (error) {
    console.error("Something went wrong with getConversation", error);
    return null;
  }
}
