'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FeatureProgress } from '../hooks/useSprintMetrics';

interface DeveloperInfo {
  name: string;
  role: string;
  score: number;
  progress: number;
}

interface SprintMetricsProps {
  features: FeatureProgress[];
  developers: DeveloperInfo[];
}

export function SprintMetrics({ features, developers }: SprintMetricsProps) {
  const totalProgress = features.length > 0
    ? features.reduce((sum, f) => sum + f.progress, 0) / features.length
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progression du sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progression globale</span>
                <span className="font-mono">
                  {Math.round(totalProgress * 100)}%
                </span>
              </div>
              <Progress value={totalProgress * 100} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Fonctionnalités</h4>
              {features.map((feature) => (
                <div key={feature.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{feature.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {Math.round(feature.progress * 100)}%
                      </span>
                      <Badge 
                        variant={feature.on_time ? 'default' : 'destructive'}
                        className="h-5 text-xs"
                      >
                        {feature.on_time ? 'Dans les temps' : 'En retard'}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={feature.progress * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {feature.done} tâches sur {feature.tasks} terminées
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Équipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {developers.map((dev) => (
              <div key={dev.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {dev.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{dev.name}</div>
                  <div className="text-sm text-muted-foreground">{dev.role}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-mono">{Math.round(dev.progress)}%</div>
                    <div className="text-xs text-muted-foreground">Progression</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono">{dev.score}/100</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>
                <div className="w-24">
                  <div className="text-right font-mono text-sm">
                    {dev.role.split(' ')[0]}
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {dev.role.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
