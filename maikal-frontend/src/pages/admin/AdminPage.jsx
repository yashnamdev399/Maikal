import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginPage      from './LoginPage';
import AdminLayout    from './AdminLayout';
import ProductsTab    from './tabs/ProductsTab';
import PostsTab       from './tabs/PostsTab';
import GalleryTab     from './tabs/GalleryTab';
import MessagesTab    from './tabs/MessagesTab';
import ActivitiesTab  from './tabs/ActivitiesTab';
import PublicationsTab from './tabs/PublicationsTab';
import HeroTab        from './tabs/HeroTab';
import TestimonialsTab from './tabs/TestimonialsTab';

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/admin/login" replace />;
}

export default function AdminPage() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={
        <ProtectedRoute>
          <AdminLayout>
            <Routes>
              <Route index          element={<Navigate to="products" replace />} />
              <Route path="products"    element={<ProductsTab />} />
              <Route path="posts"       element={<PostsTab />} />
              <Route path="gallery"     element={<GalleryTab />} />
              <Route path="messages"    element={<MessagesTab />} />
              <Route path="activities"   element={<ActivitiesTab />} />
              <Route path="publications" element={<PublicationsTab />} />
              <Route path="hero"         element={<HeroTab />} />
              <Route path="testimonials" element={<TestimonialsTab />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
