# Changelog

All notable changes to StellarPledge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.1] - 2025-10-26

### 🐛 Bug Fixes
- ✅ Fixed campaign status showing "Failed" when 100% funded
- ✅ Fixed "View Details" button navigation
- ✅ Added smart status calculation based on funding and deadline
- ✅ Improved status display consistency across all pages

### 🧹 Repository Cleanup
- ✅ Removed temporary fix guides and duplicate documentation
- ✅ Removed old `/docs` folder (consolidated into `/documentation`)
- ✅ Removed demo-accounts folder (info in documentation)
- ✅ Cleaned up root directory files
- ✅ Organized documentation structure
- ✅ Added MIT License file

---

## [1.0.0] - 2025-10-26

### 🎉 Initial Release - Demo Ready

#### Added

**Core Features**
- ✅ Multi-user authentication system (Login, Register, Role Selection)
- ✅ Role-based dashboards (Creator Dashboard, Funder Dashboard)
- ✅ Campaign creation wizard (3-step process)
- ✅ Pledge functionality with reward preview
- ✅ Wallet integration (Create, Import, Read-only modes)
- ✅ Mock balance system (10,000 XLM initial per user)
- ✅ Real-time UI updates across components
- ✅ Event-driven architecture for multi-tab sessions

**Smart Contract**
- ✅ Complete Soroban smart contract implementation
- ✅ Campaign creation with configurable parameters
- ✅ Automated reward distribution logic
- ✅ Threshold-based incentive system
- ✅ Pledge management with escrow
- ✅ Refund mechanism for failed campaigns
- ✅ Fund claiming for successful campaigns

**User Interface**
- ✅ Modern responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion
- ✅ Dark/light theme support
- ✅ Toast notifications for user feedback
- ✅ Progress bars and status badges
- ✅ Professional typography and icons

**Documentation**
- ✅ Complete README with project overview
- ✅ Live Demo Script (copy/paste ready)
- ✅ Complete Demo Guide (8-9 minute walkthrough)
- ✅ Pre-Demo Checklist
- ✅ Technical documentation (10+ guides)
- ✅ API documentation
- ✅ Troubleshooting guides

**Real Blockchain Integration**
- ✅ Alice's funded testnet account (9,999 XLM)
- ✅ Stellar Horizon API integration
- ✅ Hybrid mode support (real/mock balances)
- ✅ Real wallet keypair generation
- ✅ Stellar.expert verification links

**Demo System**
- ✅ Demo user setup utility
- ✅ Debug console commands
- ✅ Emergency reset functionality
- ✅ Balance management utilities
- ✅ Campaign and user viewing tools

#### Project Structure
- ✅ Organized documentation into `/documentation` folder
- ✅ Categorized guides: demo/, technical/, guides/
- ✅ Clean project root
- ✅ Comprehensive .gitignore
- ✅ Demo accounts in dedicated folder

---

## Development Milestones

### Phase 1: Foundation (Week 1)
- Set up React project structure
- Implement wallet service
- Create basic UI components
- Stellar SDK integration

### Phase 2: Authentication & Roles (Week 1)
- User registration and login
- Role selection system
- localStorage persistence
- Session management

### Phase 3: Campaign System (Week 2)
- Campaign creation wizard
- Campaign listing and filtering
- Campaign detail pages
- Progress tracking

### Phase 4: Pledge System (Week 2)
- Pledge form and validation
- Balance management
- Reward threshold logic
- Real-time updates

### Phase 5: Smart Contract (Week 2)
- Soroban contract development
- Automated reward distribution
- Escrow mechanism
- Cross-contract calls

### Phase 6: Polish & Demo (Week 3)
- UI/UX improvements
- Bug fixes
- Documentation creation
- Demo preparation

### Phase 7: Real Integration (Week 3)
- Funded testnet accounts
- Horizon API integration
- Hybrid balance system
- Blockchain verification

### Phase 8: Final Cleanup (Week 3)
- Documentation organization
- Code cleanup
- Repository structure
- Demo script creation

---

## Statistics

### Code
- **Frontend**: ~5,000+ lines
- **Smart Contract**: ~250 lines
- **Components**: 30+
- **Pages**: 8 main pages
- **Utils**: 10+ utility modules

### Documentation
- **Total Files**: 12 guides
- **Total Pages**: 200+
- **Categories**: 3 (demo, technical, guides)

### Features
- **Major Features**: 15+
- **UI Components**: 30+
- **Wallet Modes**: 3
- **User Roles**: 2

---

## Known Issues

### Current Limitations
- Smart contract not deployed to testnet (code complete)
- Bob & Charlie secret keys not added (public keys available)
- Backend authentication not implemented (demo uses localStorage)
- No email notifications
- No campaign approval workflow

### Future Enhancements
- Deploy smart contract to testnet
- Add backend API server
- Implement campaign milestones
- Add social sharing features
- Create analytics dashboard
- Deploy to mainnet

---

## Contributors

- **Pswaikar1742** - Initial development

---

## Links

- **Repository**: https://github.com/Pswaikar1742/StellarPledge
- **Documentation**: [/documentation](documentation/)
- **Demo Script**: [documentation/demo/LIVE_DEMO_SCRIPT.md](documentation/demo/LIVE_DEMO_SCRIPT.md)

---

*Last Updated: October 26, 2025*
