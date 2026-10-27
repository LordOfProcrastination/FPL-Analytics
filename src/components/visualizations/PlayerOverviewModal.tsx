import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PlayerOverviewCard from "./PlayerOverviewCard";
import type { ISquadPlayer } from "../../hooks/UseTeamSquad";

export default function PlayerOverviewModal({ pick, onClose }: { pick: ISquadPlayer; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current!;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="player-modal"
      aria-label={`${pick.player.web_name} player overview`}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
        }
      }}
    >
      <PlayerOverviewCard pick={pick} onClose={onClose} />
    </dialog>,
    document.body,
  );
}
