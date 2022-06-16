const { expect } = require('chai')
const { ethers, upgrades } = require('hardhat')

const bigNum = num=>(num + '0'.repeat(18))
const smallNum = num=>(parseInt(num)/bigNum(1))

describe('VeSvy Contract', function () {
   before (async function () {
      [
         this.owner,
         this.moderator1,
         this.moderator2,
         this.moderator3,
         this.moderator4,
         this.moderator5
      ] = await ethers.getSigners()

      this.MockERC20 = await ethers.getContractFactory('MockERC20')
      this.MockERC20 = await this.MockERC20.deploy()
      await this.MockERC20.deployed()

      this.claimContract = await ethers.getContractFactory('Claim')
      this.claimContract = await this.claimContract.deploy(
         [
            this.moderator1.address,
            this.moderator2.address,
            this.moderator3.address,
            this.moderator4.address,
            this.moderator5.address
         ],
         [
            bigNum(10), 
            bigNum(20), 
            bigNum(30), 
            bigNum(40), 
            bigNum(50)
         ],
         this.MockERC20.address
      )
      await this.claimContract.deployed()

      await this.MockERC20.transfer(this.claimContract.address, bigNum(150))
   })

   it ('check initial state', async function () {
      expect (smallNum(await this.claimContract.tokenBalance(this.moderator1.address))).to.equal(10)
   })

   it ('try to claim token with account not whitelisted', async function () {
      await expect (
         this.claimContract.claim()
      ).to.be.revertedWith('no permission')
   })

   it ('claim token with whitelisted account', async function () {
      let before_bal = await this.MockERC20.balanceOf(this.moderator1.address)
      before_bal = smallNum(before_bal)

      await this.claimContract.connect(this.moderator1).claim()

      let after_bal = await this.MockERC20.balanceOf(this.moderator1.address)
      after_bal = smallNum(after_bal)

      expect (after_bal - before_bal).to.equal(10)
   })

})