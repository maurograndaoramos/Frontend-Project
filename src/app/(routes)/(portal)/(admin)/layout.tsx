import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar p-4 bg-gray-100 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav className="mb-4">
          <ul>
            <li className="mb-2">
              <a href="/control-panel" className="text-blue-600 hover:underline">
                Control Panel
              </a>
            </li>
            {/* Add more admin navigation links as needed */}
          </ul>
        </nav>
      </div>
      <main className="admin-content p-4">
        {children}
      </main>
    </div>
  );
}
