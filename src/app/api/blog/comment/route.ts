import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const DEFAULT_COMMENTS = [
  {
    postId: '1',
    author: 'Rahul Sharma',
    date: 'June 15',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    text: 'Great article! The information about smart IT gadgets and modern technology solutions is very useful. VALNQIX provides amazing insights about the latest products and helps customers make better technology choices.',
    isReply: false
  },
  {
    postId: '1',
    author: 'Priya Mehra',
    date: 'June 15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    text: 'This blog explains technology trends in a very simple and effective way. The product recommendations and smart workspace ideas are helpful for anyone looking to upgrade their setup.',
    isReply: true
  },
  {
    postId: '1',
    author: 'Seema Mishra',
    date: 'June 15',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'Excellent content! The explanation of IT gadgets, accessories, and future technology solutions is informative. Looking forward to more updates and technology guides from VALNQIX.',
    isReply: false
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId') || '1';

    const db = await getDb();
    const collection = db.collection('comments');

    // Check total comment count in db
    const totalCount = await collection.countDocuments();
    if (totalCount === 0) {
      // Seed comments if empty
      await collection.insertMany(DEFAULT_COMMENTS);
    }

    const comments = await collection.find({ postId }).toArray();
    
    // Map _id to string id for compatibility
    const formatted = comments.map(doc => ({
      id: doc._id.toString(),
      postId: doc.postId,
      author: doc.author,
      date: doc.date,
      avatar: doc.avatar,
      text: doc.text,
      isReply: doc.isReply
    }));

    return NextResponse.json({ success: true, comments: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, author, email, text, isReply } = body;

    if (!postId || !author || !email || !text) {
      return NextResponse.json(
        { success: false, error: 'Post ID, author name, email, and comment text are required.' },
        { status: 400 }
      );
    }

    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80'
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const dateOptions: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);

    const newComment = {
      postId,
      author,
      email,
      date: formattedDate,
      avatar: randomAvatar,
      text,
      isReply: !!isReply
    };

    const db = await getDb();
    const result = await db.collection('comments').insertOne(newComment);

    return NextResponse.json({
      success: true,
      comment: {
        id: result.insertedId.toString(),
        ...newComment
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
