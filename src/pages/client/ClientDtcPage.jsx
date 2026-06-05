import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ClientHeader from '../../components/layout/ClientHeader';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import RecurringOrdersTab from '../../features/portfolio/RecurringOrdersTab';
import { portfolioApi } from '../../api/endpoints/portfolio';
import { useAuthStore } from '../../store/authStore';
import styles from '../dtc/DtcPage.module.css';

export default function ClientDtcPage() {
  const pageRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const initFromStorage = useAuthStore((state) => state.initFromStorage);

  const [ownedAssets, setOwnedAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const clientId = user?.client_id ?? user?.clientId ?? user?.identity_id ?? user?.identityId ?? user?.id;
  const ownerName = user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.name;

  useEffect(() => {
    if (!user) initFromStorage();
  }, [user, initFromStorage]);

  useEffect(() => {
    const loadAssets = async () => {
      if (!clientId) return;

      try {
        setLoading(true);
        setError('');

        const res = await portfolioApi.getClientPortfolio(clientId);
        const rawData = res?.data ?? res;
        const allAssets = Array.isArray(rawData) ? rawData : (rawData?.assets ?? []);

        setOwnedAssets(allAssets.filter((asset) => asset.type?.toUpperCase() !== 'OPTION'));
      } catch (err) {
        setError(err?.response?.data?.message ?? err?.message ?? 'Nije moguće učitati hartije za DTC.');
        setOwnedAssets([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [clientId]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.page-anim', { opacity: 0, y: 20, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
    }, pageRef);
    return () => ctx.revert();
  }, [loading, error, ownedAssets.length]);

  if (!user) return null;

  return (
    <div ref={pageRef} className={styles.stranica}>
      <ClientHeader activeNav="dtc" />

      <main className={styles.sadrzaj}>
        <div className="page-anim">
          <div className={styles.breadcrumb}><span>Moj nalog</span></div>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>DTC - Trajni nalozi</h1>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={styles.center}><Spinner /></div>
        ) : error ? (
          <div className={styles.center}><Alert tip="greska" poruka={error} /></div>
        ) : (
          <div className={`page-anim ${styles.contentCard}`}>
            <RecurringOrdersTab
              ownerId={clientId}
              ownerName={ownerName}
              ownedAssets={ownedAssets}
              isClient
            />
          </div>
        )}
      </main>
    </div>
  );
}
