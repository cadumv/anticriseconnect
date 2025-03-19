
import { useSuggestions } from "./suggestions/useSuggestions";
import { SuggestionsCard } from "./suggestions/SuggestionsCard";
import { LoadingSkeleton } from "./suggestions/LoadingSkeleton";

export const ProfileSuggestions = () => {
  const {
    suggestedUsers,
    connectionSuggestions,
    loading,
    handleFollow,
    handleConnect
  } = useSuggestions();

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SuggestionsCard
        title="Mais perfis para você"
        users={suggestedUsers}
        type="follow"
        onAction={handleFollow}
        showViewAllLink={true}
      />

      <SuggestionsCard
        title="Pessoas que talvez você conheça"
        users={connectionSuggestions}
        type="connect"
        onAction={handleConnect}
        showViewAllLink={false}
      />
    </div>
  );
};
