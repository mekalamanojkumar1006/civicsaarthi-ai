import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { ProtectedRoute, PublicOnlyRoute } from '@/components/common/ProtectedRoute'

// Pages
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import SchemesPage from '@/pages/SchemesPage'
import SchemeDetailPage from '@/pages/SchemeDetailPage'
import EligibilityPage from '@/pages/EligibilityPage'
import AssistantPage from '@/pages/AssistantPage'
import DocumentAssistantPage from '@/pages/DocumentAssistantPage'
import DocumentsPage from '@/pages/DocumentsPage'
import ComparePage from '@/pages/ComparePage'
import SavedPage from '@/pages/SavedPage'
import ProfilePage from '@/pages/ProfilePage'

/**
 * AppRoutes — Central routing structure for CivicSaarthi AI.
 *
 * Route groups:
 *   - PublicLayout : Landing Page (HomePage)
 *   - AuthLayout   : Login, Register (Guarded by PublicOnlyRoute)
 *   - AppLayout    : Dashboard & citizen modules (Guarded by ProtectedRoute)
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Layout ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* ── Auth Layout (Redirects if already authenticated) ── */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
      </Route>

      {/* ── App Layout (Protected Citizen Portal) ── */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/schemes/:id" element={<SchemeDetailPage />} />
        <Route path="/eligibility" element={<EligibilityPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/document-assistant" element={<DocumentAssistantPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
