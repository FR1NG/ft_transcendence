
export const iconColor = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'green-darken-2'
    case 'OWNER':
      return 'amber-lighten-1'
    default:
      return 'light-blue-darken-1'
  }
}

export const getIcon = (role: string): string => {
  switch (role) {
    case 'ADMIN':
      return 'mdi-shield-edit-outline'
    case 'OWNER':
      return 'mdi-shield-crown-outline'
    case 'USER':
      return 'mdi-account-cowboy-hat-outline'
    default:
      return 'mdi-shield-account-outline'
  }
}
