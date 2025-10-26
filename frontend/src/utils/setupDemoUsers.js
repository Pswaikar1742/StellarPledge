// Setup demo users for testing
// Run this in browser console: window.setupDemoUsers()

export const setupDemoUsers = () => {
  const demoUsers = [
    {
      id: 'alice-' + Date.now(),
      name: 'Alice',
      email: 'alice@example.com',
      password: 'alice123',
      role: 'creator',
      createdAt: new Date().toISOString()
    },
    {
      id: 'bob-' + Date.now(),
      name: 'Bob',
      email: 'bob@example.com',
      password: 'bob123',
      role: 'funder',
      createdAt: new Date().toISOString()
    },
    {
      id: 'charlie-' + Date.now(),
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'charlie123',
      role: 'funder',
      createdAt: new Date().toISOString()
    }
  ];

  // Get existing users
  const existingUsers = JSON.parse(localStorage.getItem('stellarpledge_users') || '[]');
  
  // Add demo users if they don't exist
  demoUsers.forEach(demoUser => {
    const exists = existingUsers.some(u => u.email === demoUser.email);
    if (!exists) {
      existingUsers.push(demoUser);
    }
  });

  localStorage.setItem('stellarpledge_users', JSON.stringify(existingUsers));
  
  console.log('✅ Demo users created!');
  console.log('Alice (Creator): alice@example.com / alice123');
  console.log('Bob (Funder): bob@example.com / bob123');
  console.log('Charlie (Funder): charlie@example.com / charlie123');
  
  return demoUsers;
};

// Helper to check current logged-in user
export const whoAmI = () => {
  const user = JSON.parse(localStorage.getItem('stellarpledge_current_user'));
  if (user) {
    console.log('👤 Logged in as:', user.name);
    console.log('📧 Email:', user.email);
    console.log('🎭 Role:', user.role || 'No role selected');
    console.log('🆔 ID:', user.id);
    return user;
  } else {
    console.log('❌ No user logged in');
    return null;
  }
};

// Helper to view all campaigns
export const viewCampaigns = () => {
  const campaigns = JSON.parse(localStorage.getItem('stellarpledge_campaigns') || '[]');
  console.log('📋 Total campaigns:', campaigns.length);
  campaigns.forEach((c, i) => {
    console.log(`\n${i + 1}. ${c.title}`);
    console.log(`   Goal: ${c.pledged}/${c.goal} XLM (${Math.round(c.pledged/c.goal*100)}%)`);
    console.log(`   Status: ${c.status}`);
    console.log(`   Backers: ${c.backers}`);
    console.log(`   Reward tier: ${c.rewardTier.minAmount} XLM = 1 ${c.rewardTier.tokenCode}`);
  });
  return campaigns;
};

// Helper to view all users
export const viewUsers = () => {
  const users = JSON.parse(localStorage.getItem('stellarpledge_users') || '[]');
  console.log('👥 Total users:', users.length);
  users.forEach((u, i) => {
    console.log(`${i + 1}. ${u.name} (${u.email}) - Role: ${u.role || 'None'}`);
  });
  return users;
};

// Make it available globally for easy access
if (typeof window !== 'undefined') {
  window.setupDemoUsers = setupDemoUsers;
  window.whoAmI = whoAmI;
  window.viewCampaigns = viewCampaigns;
  window.viewUsers = viewUsers;
  
  // Make functions available globally for debugging
  console.log('🚀 StellarPledge Debug Commands Available:');
  console.log('  window.setupDemoUsers() - Create demo users (Alice, Bob, Charlie)');
  console.log('  window.whoAmI() - Check current logged-in user');
  console.log('  window.viewCampaigns() - List all campaigns');
  console.log('  window.viewUsers() - List all registered users');
  console.log('\n💰 Wallet Balance Commands:');
  console.log('  window.walletBalance.get(publicKey) - Get balance');
  console.log('  window.walletBalance.set(publicKey, amount) - Set balance');
  console.log('  window.walletBalance.init(publicKey, 10000) - Initialize balance');
  console.log('  window.walletBalance.getAll() - View all balances');
}
