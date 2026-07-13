import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const DEFAULT_BLOGS = Array.from({ length: 9 }).map((_, index) => {
  const pageNum = index + 1;
  const isFirst = pageNum === 1;
  return {
    id: String(pageNum),
    tag: "Laptops & Computers",
    title: isFirst ? "5 MUST-HAVE GADGETS FOR THE MODERN HOME" : `5 MUST-HAVE GADGETS FOR THE MODERN HOME - PART ${pageNum}`,
    excerpt: "Dive into the world of cutting-edge technology with our latest blog post, where we highlight five must-have gadgets for the modern home.",
    image: "https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png",
    status: "Published",
    featured: isFirst,
    category: "Laptops & Computers",
    tags: "Tech, Tips, Gadgets",
    sortOrder: index,
    authorPhoto: "",
    authorName: "Admin Team",
    authorDesignation: "Blog Panel Writer",
    authorBio: "Short bio...",
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    blocks: [
      {
        id: "block-1",
        type: "paragraph",
        text: "Technology has completely changed the way we work and live. A smart workspace is not only about having a computer, but also about using the right IT gadgets that improve productivity, comfort, and efficiency. From high-performance devices to smart accessories, modern technology helps create a better working experience."
      },
      {
        id: "block-2",
        type: "paragraph",
        text: "At RHST, we bring you the latest IT products and solutions designed to make your digital journey smoother, faster, and more reliable."
      },
      {
        id: "block-3",
        type: "blockquote",
        text: "Upgrade your workspace with powerful technology that helps you work smarter, faster, and better."
      },
      {
        id: "block-4",
        type: "heading",
        text: "WHY SMART IT GADGETS ARE IMPORTANT?"
      },
      {
        id: "block-5",
        type: "paragraph",
        text: "In today’s digital world, having the right technology tools plays an important role in improving performance and saving time. Whether you are working from home, managing a business, or studying online, smart IT gadgets help you stay connected and productive."
      },
      {
        id: "block-6",
        type: "paragraph",
        text: "Modern IT devices provide better speed, security, and convenience while creating a professional and efficient workspace environment."
      },
      {
        id: "block-7",
        type: "heading",
        text: "TOP IT GADGETS EVERY MODERN WORKSPACE NEEDS"
      },
      {
        id: "block-8",
        type: "numberedList",
        items: [
          "1. High Performance Laptop: A powerful laptop is the heart of any modern workspace. With advanced processors, better storage, and improved performance, laptops allow users to complete tasks quickly and efficiently.",
          "2. Wireless Keyboard & Mouse: A wireless keyboard and mouse provide better comfort and flexibility while reducing cable clutter. They create a cleaner and more organized desk setup.",
          "3. High-Speed Router: A reliable internet connection is essential for online work, video meetings, cloud services, and business operations. A high-speed router ensures stable and faster connectivity.",
          "4. External Storage Devices: External hard drives and SSDs help protect important files, documents, and business data. They provide additional storage space and secure backup solutions.",
          "5. Smart Accessories: Webcams, headphones, USB hubs, and other smart accessories improve communication and make daily digital tasks easier."
        ]
      },
      {
        id: "block-9",
        type: "callout",
        image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&auto=format&fit=crop&q=80",
        title: "THE FUTURE OF SMART TECHNOLOGY",
        subtitle: "SMART TECHNOLOGY. BETTER PERFORMANCE.",
        description: "Technology continues to evolve every day, bringing smarter and more efficient solutions for homes and businesses. Investing in the right IT gadgets helps users improve productivity while enjoying a seamless digital experience.\n\nAt RHST, we provide trusted IT products and solutions that help customers build modern, connected, and future-ready workspaces."
      },
      {
        id: "block-10",
        type: "heading",
        text: "POWERFUL DEVICES FOR A SMARTER DIGITAL EXPERIENCE"
      },
      {
        id: "block-11",
        type: "paragraph",
        text: "The right technology can transform the way you work, communicate, and manage daily tasks. From professional workspaces to personal setups, smart IT gadgets provide better performance, improved connectivity, and greater convenience."
      },
      {
        id: "block-12",
        type: "paragraph",
        text: "Choosing reliable technology products ensures long-term efficiency and helps users stay prepared for future digital challenges."
      },
      {
        id: "block-13",
        type: "heading",
        text: "BUILD YOUR FUTURE-READY WORKSPACE WITH RHST"
      },
      {
        id: "block-14",
        type: "paragraph",
        text: "At RHST, we focus on delivering quality IT solutions that combine innovation, reliability, and performance. Our goal is to make advanced technology easily accessible for individuals and businesses."
      },
      {
        id: "block-15",
        type: "paragraph",
        text: "Explore the latest IT products and upgrade your digital experience with RHST."
      }
    ]
  };
});

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('blogs');

    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(DEFAULT_BLOGS);
    }

    const blogs = await collection.find({ status: 'Published' }).sort({ sortOrder: 1, createdAt: -1 }).toArray();
    const formatted = blogs.map(doc => ({
      id: doc._id.toString(),
      tag: doc.tag || 'Laptops & Computers',
      title: doc.title,
      excerpt: doc.excerpt || '',
      image: doc.image || 'https://ik.imagekit.io/zp0tch54w/RHST/wmremove-transformed.png',
      link: `/blog/${doc._id.toString()}`,
      category: doc.category || 'Laptops & Computers',
      tags: doc.tags || '',
      authorName: doc.authorName || 'Admin Team',
      createdAt: doc.createdAt
    }));

    return NextResponse.json({ success: true, blogs: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
