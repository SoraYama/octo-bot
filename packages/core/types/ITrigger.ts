export enum TriggerMethod {
  FullMatch = 0,
  Prefix,
  Keyword,
  RegExp,
}

export interface ITrigger {
  methods: TriggerMethod[];
  match: string;
  onlyToMe?: boolean;
  helpText?: string;
}
