export interface RewardsCard {
  id: string
  user_id: string
  retailer_name: string
  retailer_logo: string | null
  card_number: string | null
  card_type: string
  is_linked: boolean
  linked_at: string | null
  created_at: string
  updated_at: string
}

export interface PopularRetailer {
  name: string
  logo: string
  type: 'grocery' | 'warehouse' | 'pharmacy' | 'general'
  loginUrl?: string
}

export const POPULAR_RETAILERS: PopularRetailer[] = [
  {
    name: 'Kroger',
    logo: '🛒',
    type: 'grocery',
    loginUrl: 'https://www.kroger.com/signin'
  },
  {
    name: 'Safeway',
    logo: '🏪',
    type: 'grocery',
    loginUrl: 'https://www.safeway.com/account/sign-in.html'
  },
  {
    name: 'Walmart',
    logo: '🏬',
    type: 'general',
    loginUrl: 'https://www.walmart.com/account/login'
  },
  {
    name: 'Target',
    logo: '🎯',
    type: 'general',
    loginUrl: 'https://www.target.com/login'
  },
  {
    name: 'Costco',
    logo: '📦',
    type: 'warehouse',
    loginUrl: 'https://www.costco.com/LogonForm'
  },
  {
    name: "Sam's Club",
    logo: '🏭',
    type: 'warehouse',
    loginUrl: 'https://www.samsclub.com/login'
  },
  {
    name: 'CVS',
    logo: '💊',
    type: 'pharmacy',
    loginUrl: 'https://www.cvs.com/account/login'
  },
  {
    name: 'Walgreens',
    logo: '⚕️',
    type: 'pharmacy',
    loginUrl: 'https://www.walgreens.com/login.jsp'
  },
  {
    name: 'Whole Foods',
    logo: '🥬',
    type: 'grocery',
    loginUrl: 'https://www.amazon.com/ap/signin'
  },
  {
    name: 'Trader Joes',
    logo: '🌺',
    type: 'grocery'
  },
  {
    name: 'Albertsons',
    logo: '🛍️',
    type: 'grocery',
    loginUrl: 'https://www.albertsons.com/account/sign-in.html'
  },
  {
    name: 'Publix',
    logo: '🏖️',
    type: 'grocery',
    loginUrl: 'https://www.publix.com/myaccount/login'
  }
]