import React, { ReactElement } from "react";

export const PopoverState = (props: {
  children(params: {
    anchorEl: HTMLButtonElement | null;
    handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleClose: () => void;
    open: boolean;
  }): ReactElement;
}) => {
  const { children } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return <>{children({ anchorEl, handleClick, handleClose, open })}</>;
};

export const OpenState = (props: {
  children(params: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
  }): ReactElement;
}) => {
  const { children } = props;
  const [open, setOpen] = React.useState<boolean>(false);

  return <>{children({ open, setOpen })}</>;
};


