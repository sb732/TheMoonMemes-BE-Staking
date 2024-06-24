const Staking = require("../models/Staking");

exports.addStakedBalance = async (req, res) => {
  const { wallet_address, staked_balance } = req.body;
  try {
    const staking = new Staking({ wallet_address, staked_balance });
    await staking.save();
    res.status(201).send(staking);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStakedBalance = async (req, res) => {
  const { wallet_address } = req.params;
  try {
    const staking = await Staking.findOne({ wallet_address });
    if (!staking) return res.status(404).send("Wallet address not found");
    res.send(staking.staked_balance);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTotalStakedBalance = async (req, res) => {
  try {
    const totalStaked = await Staking.aggregate([
      { $group: { _id: null, total: { $sum: "$staked_balance" } } },
    ]);
    res.send(totalStaked[0].total);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.withdrawStakedBalance = async (req, res) => {
  const { wallet_address } = req.params;
  try {
    const staking = await Staking.findOneAndDelete({ wallet_address });
    if (!staking) return res.status(404).send("Wallet address not found");
    res.send("Staked balance withdrawn");
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getPoolPercent = async (req, res) => {
  const { wallet_address } = req.params;
  try {
    const walletStaking = await Staking.findOne({ wallet_address });
    if (!walletStaking) return res.status(404).send("Wallet address not found");

    const totalStaked = await Staking.aggregate([
      { $group: { _id: null, total: { $sum: "$staked_balance" } } },
    ]);

    const poolPercent =
      (walletStaking.staked_balance / totalStaked[0].total) * 100;
    res.send(poolPercent.toFixed(2));
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getEstimatedRewards = async (req, res) => {
  try {
    const annualRate = 134; // in percentage
    const monthlyRate = annualRate / 12;
    const dailyRate = annualRate / 365;
    res.send({ monthlyRate, dailyRate });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getCurrentRewards = async (req, res) => {
  try {
    const rewardsPerBlock = 71.53;
    res.send({ rewardsPerBlock });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTotalRewards = async (req, res) => {
  const { wallet_address } = req.params;
  try {
    const walletStaking = await Staking.findOne({ wallet_address });
    if (!walletStaking) return res.status(404).send("Wallet address not found");

    const totalStaked = await Staking.aggregate([
      { $group: { _id: null, total: { $sum: "$staked_balance" } } },
    ]);

    const poolPercent = walletStaking.staked_balance / totalStaked[0].total;
    const totalRewards = poolPercent * 71.53; // assuming rewards per block
    res.send(totalRewards.toFixed(2));
  } catch (error) {
    res.status(400).send(error);
  }
};
