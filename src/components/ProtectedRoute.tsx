import { Navigate, useLocation } from 'react-router-dom';

// Very simple auth/role check using localStorage JWT
const decodeToken = (token: string) => {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		return JSON.parse(jsonPayload);
	} catch {
		return null;
	}
};

interface ProtectedRouteProps {
	children: React.ReactElement;
	requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = true }) => {
	const location = useLocation();
	const token = localStorage.getItem('token');

	// Not logged in at all -> go to login
	if (!token) {
		return <Navigate to="/signin" replace state={{ from: location }} />;
	}

	// If we need to ensure the user is an admin or management team, check the payload fields.
	if (requireAdmin) {
		const payload = decodeToken(token);
		if (!payload) {
			return <Navigate to="/forbidden" replace />;
		}

		const userType = payload?.userType;
		const isAdmin = userType === 'Admin';
		const isManagementTeam = userType === 'Management Team' || userType === 'MT' || userType === 'MT-member';

		// Allow if admin or management team
		if (!isAdmin && !isManagementTeam) {
			return <Navigate to="/forbidden" replace />;
		}
	}

	return children;
};

export default ProtectedRoute;
