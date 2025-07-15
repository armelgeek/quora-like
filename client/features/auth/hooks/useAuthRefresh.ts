// Hook utilitaire pour déclencher une mise à jour de l'état d'authentification
export function useAuthRefresh() {
  const refreshAuth = () => {
    // Déclencher un événement pour forcer tous les composants à vérifier l'état d'auth
    window.dispatchEvent(new CustomEvent('forceAuthRefresh'));
  };

  return { refreshAuth };
}
