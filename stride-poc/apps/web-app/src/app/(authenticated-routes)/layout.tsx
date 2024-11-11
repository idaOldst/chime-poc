import { Header } from '@components';
import { ROUTES } from '@utils/config/constants';
import React from 'react';
import ProtectedRoute from '../../components/global/protected-route/protected-route';
import ProfileHeaderMenu from '../../components/modules/dashboard/profile-header-menu/profile-header-menu';
import { ILayout } from '../../types/layout';
import styles from './styles.module.scss';

const AuthenticatedRouteLayout: React.FC<ILayout> = ({ children }) => {
    return (
        <div className={styles['authenticated-route']}>
            <Header
                home={{
                    imageLink: undefined,
                    label: 'App Title',
                    homeLink: ROUTES.DASHBOARD
                }}
                rightAction={<ProfileHeaderMenu />} />

            <div className={styles['authenticated-route__content']}>
                <ProtectedRoute>
                    {children}
                </ProtectedRoute>
            </div>
        </div>
    )
}

export default AuthenticatedRouteLayout;