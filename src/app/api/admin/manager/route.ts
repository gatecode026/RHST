import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity';
import { ObjectId } from 'mongodb';

// GET — list all admin accounts
export async function GET() {
  try {
    const db = await getDb();
    const admins = await db.collection('admin_credentials').find().toArray();

    const formatted = admins.map(doc => ({
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email || '',
      role: doc.role || 'SUPER ADMIN',
      status: doc.status || 'Active',
      createdAt: doc.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({ success: true, admins: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST — update own credentials (or add a new admin if action='add')
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    const db = await getDb();
    const collection = db.collection('admin_credentials');

    // Add a new admin (super admin only action from frontend)
    if (action === 'add') {
      const { username, email, password, role } = body;
      if (!username || !password) {
        return NextResponse.json({ success: false, error: 'Username and password are required.' }, { status: 400 });
      }

      const existing = await collection.findOne({ username });
      if (existing) {
        return NextResponse.json({ success: false, error: 'Username already exists.' }, { status: 409 });
      }

      const result = await collection.insertOne({
        username,
        email: email || '',
        password,
        role: role || 'PRODUCT MANAGER',
        status: 'Active',
        createdAt: new Date().toISOString(),
      });

      await logActivity('Created Admin Account', `New admin "${username}" (${role || 'PRODUCT MANAGER'}) was added.`);

      return NextResponse.json({
        success: true,
        admin: {
          id: result.insertedId.toString(),
          username,
          email: email || '',
          role: role || 'PRODUCT MANAGER',
          status: 'Active',
          createdAt: new Date().toISOString(),
        }
      });
    }

    // Update own credentials (legacy path)
    const { currentUsername, newUsername, newPassword } = body;
    if (!currentUsername || !newUsername || !newPassword) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    const admin = await collection.findOne({ username: currentUsername });
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Current admin account not found.' }, { status: 404 });
    }

    await collection.updateOne(
      { _id: admin._id },
      {
        $set: {
          username: newUsername,
          password: newPassword,
          updatedAt: new Date().toISOString()
        }
      }
    );

    await logActivity('Updated Admin Account', `Changed credentials from "${currentUsername}" to "${newUsername}"`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT — edit an admin's role/email/status/username/password
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, username, email, password, role, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Admin ID is required.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('admin_credentials');

    const updateFields: any = { updatedAt: new Date().toISOString() };
    if (username) updateFields.username = username;
    if (email !== undefined) updateFields.email = email;
    if (password) updateFields.password = password;
    if (role) updateFields.role = role;
    if (status) updateFields.status = status;

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    await logActivity('Updated Admin Account', `Admin ID "${id}" credentials/role updated.`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE — only super admin can delete non-super-admin accounts
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Admin ID is required.' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('admin_credentials');

    // Prevent deleting super admin accounts
    const target = await collection.findOne({ _id: new ObjectId(id) });
    if (!target) {
      return NextResponse.json({ success: false, error: 'Admin account not found.' }, { status: 404 });
    }

    if ((target.role || '').toUpperCase() === 'SUPER ADMIN') {
      return NextResponse.json({ success: false, error: 'Super Admin accounts cannot be deleted.' }, { status: 403 });
    }

    await collection.deleteOne({ _id: new ObjectId(id) });

    await logActivity('Deleted Admin Account', `Admin "${target.username}" was removed by Super Admin.`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
