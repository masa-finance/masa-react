import React, { useCallback, useEffect, useMemo, useState } from 'react';
export interface SubflowPage {
  next: () => void;
  back: () => void;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface InterfaceSubflowProps {
  pages: React.FunctionComponent<SubflowPage>[];
}

export const InterfaceSubflow = ({ pages }: InterfaceSubflowProps) => {
  const [index, setIndex] = useState(0);

  const length = useMemo(() => pages.length, [pages]);

  useEffect(() => {
    setIndex(0);
  }, [pages, setIndex]);

  const next = useCallback(() => {
    if (index < length - 1) {
      setIndex(index + 1);
    }
  }, [index, setIndex, length]);

  const back = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index, setIndex]);

  return pages[index]({ next, back, setIndex });
};
