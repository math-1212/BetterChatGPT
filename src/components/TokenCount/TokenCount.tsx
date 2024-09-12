import React, { useEffect, useMemo, useState } from 'react';
import useStore from '@store/store';
import { shallow } from 'zustand/shallow';

import countTokens from '@utils/messageUtils';
import { modelCost } from '@constants/chat';

const TokenCount = React.memo(() => {
  const [tokenCount, setTokenCount] = useState<number>(0);
  const generating = useStore((state) => state.generating);
  const messages = useStore(
    (state) =>
      state.chats ? state.chats[state.currentChatIndex]?.messages : [],
    shallow
  );

  // Remplacer le modèle par défaut par 'gpt-4o'
  const model = useStore((state) =>
    state.chats
      ? state.chats[state.currentChatIndex]?.config?.model || 'gpt-4o'
      : 'gpt-4o'
  );

  const cost = useMemo(() => {
    if (!modelCost[model]) {
      console.error(`Le modèle ${model} n'a pas de coût défini.`);
      return '0.00';
    }

    const price =
      modelCost[model].prompt.price *
      (tokenCount / modelCost[model].prompt.unit);
    return price.toPrecision(3);
  }, [model, tokenCount]);

  useEffect(() => {
    if (!generating && model) setTokenCount(countTokens(messages, model));
  }, [messages, generating, model]);

  return (
    <div className='absolute top-[-16px] right-0'>
      <div className='text-xs italic text-gray-900 dark:text-gray-300'>
        Tokens: {tokenCount} (${cost})
      </div>
    </div>
  );
});

export default TokenCount;
