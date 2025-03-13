
import React from "react";

interface ReferralNoticeProps {
  referrerId: string;
}

export const ReferralNotice = ({ referrerId }: ReferralNoticeProps) => {
  if (!referrerId) return null;
  
  return (
    <div className="mt-2 text-sm text-blue-600">
      Você foi convidado por um colega engenheiro
    </div>
  );
};
