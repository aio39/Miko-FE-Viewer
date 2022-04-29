export default function chatModeCompute(amount: number, chatMode: string) {
  if (amount !== 0) return 'public';
  if (chatMode === 'public') return 'public';
  return 'private';
}
