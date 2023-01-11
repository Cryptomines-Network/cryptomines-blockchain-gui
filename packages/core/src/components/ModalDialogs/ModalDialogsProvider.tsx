import React, { useMemo, useState } from 'react';

import ModalDialogsContext from './ModalDialogsContext';

type Props = {
  children: Node;
};

let nextId = 1;

export default function ModalDialogsProvider(props: Props) {
  const { children } = props;
  const [dialogs, setDialogs] = useState([]);

  const modalDialogsContextValue = useMemo(() => {
    function hide(dialog) {
      setDialogs((prevDialogs) => prevDialogs.filter((d) => d.dialog !== dialog));
    }

    function show(dialog) {
      const id = nextId;
      nextId += 1;

      return new Promise((resolve, reject) => {
        function handleClose(value) {
          // remove modal from dom
          hide(dialog);
          if (value instanceof Error) {
            reject(value);
          }
          resolve(value);
        }

        setDialogs((prevDialogs) => [
          ...prevDialogs,
          {
            id,
            dialog,
            handleClose,
          },
        ]);
      });
    }

    return {
      show,
      hide,
      dialogs,
    };
  }, [dialogs]);

  return <ModalDialogsContext.Provider value={modalDialogsContextValue}>{children}</ModalDialogsContext.Provider>;
}
