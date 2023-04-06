import { useMasa } from '../../provider';
import React, { useCallback, useMemo, useState } from 'react';
export interface SubflowPage {
  next: () => void;
  back: () => void;
  complete: () => void;

  setIndex: React.Dispatch<React.SetStateAction<number | string>>;
  context: any;
}

interface InterfaceSubflowProps {
  pages: React.FunctionComponent<SubflowPage>[];
  situationalPages: { [key: string]: React.FunctionComponent<SubflowPage> };
  context: any;
}

const Renderer = ({
  Render,
  params,
}: {
  Render: React.FunctionComponent<SubflowPage>;
  params: SubflowPage;
}) => {
  return <Render {...params} />;
};

export const InterfaceSubflow = ({
  pages,
  context,
  situationalPages,
}: InterfaceSubflowProps) => {
  const { closeModal } = useMasa();
  const [index, setIndex] = useState<number | string>(0);

  const length = useMemo(() => pages.length, [pages]);

  const next = useCallback(() => {
    if (typeof index === 'string') return setIndex(0);
    if (index < length - 1) {
      setIndex(index + 1);
    }
  }, [index, setIndex, length]);

  const back = useCallback(() => {
    if (typeof index === 'string') return setIndex(0);
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index, setIndex]);

  if (situationalPages && typeof index === 'string') {
    return (
      <Renderer
        Render={situationalPages[index]}
        params={{
          next,
          back,
          context,
          setIndex,
          complete: () => closeModal?.(true),
        }}
      />
    );
  }
  return (
    <Renderer
      Render={pages[index]}
      params={{
        next,
        back,
        context,
        setIndex,
        complete: () => closeModal?.(true),
      }}
    />
  );
};
