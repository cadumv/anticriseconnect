
/**
 * Utility functions for handling user referrals
 */

/**
 * Updates referral tracking information in localStorage after a successful signup
 * @param referrerId The ID of the user who referred the new signup
 * @param newUserEmail The email of the newly signed up user
 */
export const trackReferralSignup = (referrerId: string, newUserEmail: string): void => {
  if (!referrerId) return;
  
  // Update referrer's referral count in localStorage
  // In a real app, this would be stored in the database
  const referralsKey = `user_referrals_${referrerId}`;
  const existingReferrals = localStorage.getItem(referralsKey);
  const referrals = existingReferrals ? JSON.parse(existingReferrals) : [];
  
  // Add this user as a referral
  const newReferral = {
    id: Date.now().toString(),
    email: newUserEmail,
    date: new Date().toISOString()
  };
  
  referrals.push(newReferral);
  localStorage.setItem(referralsKey, JSON.stringify(referrals));
  
  // Update the referrer's mission progress
  const missionsKey = `user_missions_${referrerId}`;
  const savedMissions = localStorage.getItem(missionsKey);
  
  if (savedMissions) {
    const parsedMissions = JSON.parse(savedMissions);
    const updatedMissions = parsedMissions.map((mission: any) => {
      if (mission.id === "mission-invite") {
        return {
          ...mission,
          currentProgress: Math.min(referrals.length, mission.requiredProgress)
        };
      }
      return mission;
    });
    
    localStorage.setItem(missionsKey, JSON.stringify(updatedMissions));
  }
};
