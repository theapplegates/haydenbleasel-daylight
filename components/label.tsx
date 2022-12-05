import type { FC } from 'react';
import type { PrimitiveLabelProps } from '@radix-ui/react-label';
import { Root } from '@radix-ui/react-label';
import clsx from 'clsx';

type LabelProps = PrimitiveLabelProps;

const Label: FC<LabelProps> = ({ htmlFor, ...props }) => (
  <Root
    htmlFor={htmlFor}
    className={clsx(
      'block text-sm font-medium',
      'text-zinc-700',
      'dark:text-zinc-400'
    )}
    {...props}
  />
);

export default Label;
