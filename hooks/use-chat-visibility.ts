import { useState } from 'react';
import { VisibilityType } from 'components/VisibilitySelector';

export function useChatVisibility({
  chatId,
  initialVisibilityType,
}: {
  chatId: string;
  initialVisibilityType: VisibilityType;
}) {
  const [visibilityType, setVisibilityType] = useState<VisibilityType>(
    initialVisibilityType,
  );

  // In a real application, you would likely have logic here to
  // persist or fetch the chat visibility based on the chatId.
  // For now, it's a simple state management.

  return { visibilityType, setVisibilityType };
}