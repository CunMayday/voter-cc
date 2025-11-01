/**
 * Version: 1
 * Added advanced-only fencing game board with improved turn handling and responsive layout.
 */
import { useMemo, useState } from 'react';

const initialHands = [
  [
    { id: 'fleche', name: 'Flèche', description: 'A fast running attack to close distance quickly.' },
    { id: 'riposte', name: 'Riposte', description: 'Counterattack immediately after a successful parry.' },
    { id: 'parry-four', name: 'Parry Four', description: 'Deflect an incoming attack to your inside line.' }
  ],
  [
    { id: 'lunge', name: 'Lunge', description: 'Explosive forward attack extending the arm and front leg.' },
    { id: 'counter-parry', name: 'Counter-Parry', description: 'Defensive action to regain initiative after being parried.' },
    { id: 'disengage', name: 'Disengage', description: 'Avoid the opponent’s blade by circling around it.' }
  ]
];

const GameBoard = () => {
  const [round, setRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [pisteLog, setPisteLog] = useState([]);

  const [players, setPlayers] = useState(() =>
    initialHands.map((hand, index) => ({
      id: `player-${index + 1}`,
      name: `Player ${index + 1}`,
      hand: hand.map((card) => ({ ...card, exhausted: false })),
      selectedCardId: null
    }))
  );

  const currentPlayer = players[currentPlayerIndex];

  const selectedCardDetails = useMemo(() => {
    if (!currentPlayer?.selectedCardId) {
      return null;
    }
    return currentPlayer.hand.find((card) => card.id === currentPlayer.selectedCardId) ?? null;
  }, [currentPlayer]);

  const handleCardSelect = (playerIndex, cardId) => {
    setPlayers((prev) =>
      prev.map((player, index) => {
        if (index !== playerIndex) {
          return player;
        }
        return {
          ...player,
          selectedCardId: player.selectedCardId === cardId ? null : cardId
        };
      })
    );
  };

  const advanceTurnOrder = () => {
    setCurrentPlayerIndex((prev) => {
      const next = (prev + 1) % players.length;
      if (next === 0) {
        setRound((prevRound) => prevRound + 1);
      }
      return next;
    });
  };

  const handleResolveTurn = () => {
    if (!currentPlayer?.selectedCardId) {
      return;
    }

    const resolvedCard = currentPlayer.hand.find((card) => card.id === currentPlayer.selectedCardId);
    if (!resolvedCard) {
      return;
    }

    setPlayers((prev) =>
      prev.map((player, index) => {
        if (index !== currentPlayerIndex) {
          return player;
        }
        return {
          ...player,
          hand: player.hand.map((card) =>
            card.id === player.selectedCardId ? { ...card, exhausted: true } : card
          ),
          selectedCardId: null
        };
      })
    );

    setPisteLog((prev) => [
      {
        id: `${currentPlayer.id}-${resolvedCard.id}-round-${round}`,
        round,
        player: currentPlayer.name,
        action: resolvedCard.name,
        description: resolvedCard.description
      },
      ...prev
    ]);

    advanceTurnOrder();
  };

  const handleResetExhaustion = (playerIndex) => {
    setPlayers((prev) =>
      prev.map((player, index) => {
        if (index !== playerIndex) {
          return player;
        }
        return {
          ...player,
          hand: player.hand.map((card) => ({ ...card, exhausted: false })),
          selectedCardId: null
        };
      })
    );
  };

  const canResolve = Boolean(currentPlayer?.selectedCardId);

  return (
    <section aria-labelledby="game-board-heading" className="mb-10">
      <div className="bg-white border border-purdue-gray rounded-lg shadow-md p-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 bg-purdue-athletic-gold/10 border border-purdue-athletic-gold rounded-lg p-4">
              <h2 id="game-board-heading" className="text-2xl font-bold text-purdue-black mb-4">
                Advanced Mode
              </h2>
              <p className="text-purdue-dark-gray">
                Advanced mode is now the default. Choose actions for each player in sequence to simulate a fencing bout. Cards become selectable again as soon as it is a player&apos;s turn, even on a shared device.
              </p>
            </div>
            <div className="flex-1 bg-white border border-purdue-athletic-gold rounded-lg p-4">
              <p className="text-sm uppercase tracking-wide text-purdue-dark-gray">Round</p>
              <p className="text-3xl font-extrabold text-purdue-black">{round}</p>
              <p className="mt-2 text-purdue-dark-gray">
                Currently acting: <span className="font-semibold text-purdue-black">{currentPlayer?.name}</span>
              </p>
              <button
                type="button"
                onClick={() => handleResetExhaustion(currentPlayerIndex)}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-purdue-black rounded-md bg-purdue-athletic-gold text-purdue-black font-semibold hover:bg-purdue-black hover:text-purdue-gold transition"
              >
                Refresh Current Player&apos;s Deck
              </button>
            </div>
          </div>

          <div className="bg-purdue-gray/10 border border-purdue-gray rounded-lg p-4">
            <h3 className="text-xl font-semibold text-purdue-black mb-3">Piste Activity</h3>
            {pisteLog.length === 0 ? (
              <p className="text-purdue-dark-gray">No actions recorded yet. Select a card and resolve the turn to log it here.</p>
            ) : (
              <ol className="space-y-3">
                {pisteLog.map((entry) => (
                  <li key={entry.id} className="bg-white border border-purdue-gray rounded-md p-3">
                    <p className="font-semibold text-purdue-black">
                      Round {entry.round}: {entry.player}
                    </p>
                    <p className="text-purdue-gold font-bold">{entry.action}</p>
                    <p className="text-purdue-dark-gray text-sm">{entry.description}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="space-y-6">
            {players.map((player, playerIndex) => {
              const isCurrentPlayer = playerIndex === currentPlayerIndex;

              return (
                <section key={player.id} aria-labelledby={`${player.id}-heading`} className="border border-purdue-gray rounded-lg p-4 bg-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                    <div>
                      <h3 id={`${player.id}-heading`} className="text-xl font-semibold text-purdue-black">
                        {player.name}
                      </h3>
                      <p className="text-sm text-purdue-dark-gray">
                        {isCurrentPlayer ? 'Active turn — choose a card to resolve an action.' : 'Waiting for their turn.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleResetExhaustion(playerIndex)}
                      className="self-start inline-flex items-center justify-center px-3 py-2 border border-purdue-black rounded-md bg-white text-purdue-black font-semibold hover:bg-purdue-athletic-gold hover:text-purdue-black transition"
                    >
                      Reset Deck
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {player.hand.map((card) => {
                      const isSelected = player.selectedCardId === card.id;
                      const isDisabled = playerIndex !== currentPlayerIndex || card.exhausted;

                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => handleCardSelect(playerIndex, card.id)}
                          disabled={isDisabled}
                          className={`text-left border rounded-lg p-4 transition focus:outline-none focus:ring-2 focus:ring-purdue-athletic-gold ${
                            isSelected
                              ? 'border-purdue-athletic-gold bg-purdue-athletic-gold/20 text-purdue-black'
                              : 'border-purdue-gray bg-white text-purdue-black'
                          } ${
                            isDisabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:border-purdue-athletic-gold hover:bg-purdue-athletic-gold/10 cursor-pointer'
                          }`}
                        >
                          <span className="text-sm uppercase tracking-wide text-purdue-dark-gray block mb-1">
                            {card.exhausted ? 'Exhausted' : isSelected ? 'Selected' : 'Ready'}
                          </span>
                          <span className="text-lg font-semibold text-purdue-black block">{card.name}</span>
                          <span className="text-sm text-purdue-dark-gray block mt-2">{card.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 bg-white border border-purdue-gray rounded-lg p-4">
              <h3 className="text-lg font-semibold text-purdue-black mb-2">Selected Action</h3>
              {selectedCardDetails ? (
                <div>
                  <p className="text-purdue-gold font-bold">{selectedCardDetails.name}</p>
                  <p className="text-purdue-dark-gray text-sm mt-1">{selectedCardDetails.description}</p>
                </div>
              ) : (
                <p className="text-purdue-dark-gray text-sm">Choose a card for the current player to prepare their move.</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleResolveTurn}
              disabled={!canResolve}
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-purdue-black rounded-md bg-purdue-athletic-gold text-purdue-black font-semibold text-lg hover:bg-purdue-black hover:text-purdue-gold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resolve Turn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameBoard;
