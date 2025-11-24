import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { useState } from "react";
import { AuthService } from "@/lib/auth";

const Rankings = () => {
  const [gameMode, setGameMode] = useState<"skyblock" | "majestic">("skyblock");
  const [category, setCategory] = useState<"nivel" | "coins" | "karma">("nivel");

  // Simulate ranking data
  const generateRankings = () => {
    const users = AuthService.getAllUsers();
    const rankings = [...users]
      .sort((a, b) => {
        const aValue = a.stats?.[category] || 0;
        const bValue = b.stats?.[category] || 0;
        return bValue - aValue;
      })
      .slice(0, 50);

    return rankings.length > 0
      ? rankings
      : [
          {
            id: "1",
            username: "ProPlayer123",
            minecraft_username: "ProPlayer",
            stats: { level: 100, coins: 999999, karma: 10000 },
          },
          {
            id: "2",
            username: "MegaBuilder",
            minecraft_username: "Builder",
            stats: { level: 95, coins: 850000, karma: 8500 },
          },
          {
            id: "3",
            username: "PvPMaster",
            minecraft_username: "PvPKing",
            stats: { level: 90, coins: 750000, karma: 7200 },
          },
        ];
  };

  const rankings = generateRankings();

  const getRankIcon = (position: number) => {
    if (position === 1)
      return <Crown className="w-5 h-5 text-secondary" />;
    if (position === 2)
      return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (position === 3)
      return <Award className="w-5 h-5 text-amber-700" />;
    return <Trophy className="w-5 h-5 text-muted-foreground" />;
  };

  const formatValue = (value: number) => {
    if (category === "coins") return value.toLocaleString();
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Rankings
          </h1>
          <p className="text-lg text-muted-foreground">
            Los mejores jugadores de Darksow Network
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <Card className="p-4 bg-card/50 backdrop-blur border-border">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Modo de Juego
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={gameMode === "skyblock" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGameMode("skyblock")}
                  >
                    Skyblock
                  </Button>
                  <Button
                    variant={gameMode === "majestic" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGameMode("majestic")}
                  >
                    Majestic Mods
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Categoría
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={category === "nivel" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory("nivel")}
                  >
                    Nivel
                  </Button>
                  <Button
                    variant={category === "coins" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory("coins")}
                  >
                    Coins
                  </Button>
                  <Button
                    variant={category === "karma" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory("karma")}
                  >
                    Karma
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Rankings List */}
        <div className="max-w-4xl mx-auto space-y-2">
          {rankings.map((user, index) => {
            const position = index + 1;
            const value = user.stats?.[category] || 0;

            return (
              <Card
                key={user.id}
                className={`p-4 border-border hover:border-primary transition-all duration-300 ${
                  position <= 3 ? "bg-gradient-to-r from-card to-muted" : "bg-card/50"
                } ${position === 1 ? "shadow-glow" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 text-center">
                    {position <= 3 ? (
                      <div className="flex justify-center">
                        {getRankIcon(position)}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-muted-foreground">
                        #{position}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {user.username}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.minecraft_username || "Sin usuario MC"}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xl font-bold text-primary">
                      {formatValue(value)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {category}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {rankings.length === 0 && (
          <Card className="max-w-4xl mx-auto p-12 text-center bg-card/50 border-border">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No hay datos de ranking disponibles
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Rankings;
