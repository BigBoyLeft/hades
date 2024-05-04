export const getSource = (): string => global.source.toString();

export function getPlayerIdentifier(source: string, identifier: 'license' | 'steam' | 'discord'): string | undefined {
    return GetPlayerIdentifierByType(source, identifier);
}
