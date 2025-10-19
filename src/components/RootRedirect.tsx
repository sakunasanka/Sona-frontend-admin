import { Navigate } from 'react-router-dom';

// JWT decode utility
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

const RootRedirect: React.FC = () => {
	const token = localStorage.getItem('token');

	if (!token) {
		return <Navigate to="/signin" replace />;
	}

	// Check if token is valid (not expired)
	const payload = decodeToken(token);
	const currentTime = Math.floor(Date.now() / 1000);
	if (!payload || payload.exp < currentTime) {
		localStorage.removeItem('token');
		return <Navigate to="/signin" replace />;
	}

	// Token is valid, redirect to dashboard
	return <Navigate to="/admin-dashboard" replace />;
};

export default RootRedirect;