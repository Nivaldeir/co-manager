/**
 * Funções auxiliares para verificação de roles e permissões
 */

export type UserRole = 'user' | 'analista' | 'admin'

/**
 * Verifica se o usuário é admin
 */
export function isAdmin(role?: string | null): boolean {
  return role === 'admin'
}

/**
 * Verifica se o usuário é analista ou admin
 */
export function isAnalistaOrAdmin(role?: string | null): boolean {
  return role === 'analista' || role === 'admin'
}

/**
 * Verifica se o usuário é analista
 */
export function isAnalista(role?: string | null): boolean {
  return role === 'analista'
}

/**
 * Verifica se o usuário é um usuário comum
 */
export function isUser(role?: string | null): boolean {
  return role === 'user' || !role
}

/**
 * Verifica se o usuário tem permissão para visualizar todas as cotações
 * (analista e admin podem ver todas)
 */
export function canViewAllQuotations(role?: string | null): boolean {
  return isAnalistaOrAdmin(role)
}

/**
 * Verifica se o usuário tem permissão para responder cotações
 * (apenas analista e admin podem responder)
 */
export function canReplyQuotations(role?: string | null): boolean {
  return isAnalistaOrAdmin(role)
}

/**
 * Verifica se o usuário tem permissão para gerenciar usuários
 * (apenas admin)
 */
export function canManageUsers(role?: string | null): boolean {
  return isAdmin(role)
}

