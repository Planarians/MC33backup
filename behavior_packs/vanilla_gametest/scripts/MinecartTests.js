import * as GameTest from "GameTest";
import { BlockLocation, BlockTypes } from "Minecraft";

GameTest.register("MinecartTests", "turn", (test) => {
  const minecartEntityType = "minecart";

  const endPos = new BlockLocation(1, 2, 2);
  const startPos = new BlockLocation(1, 2, 0);

  test.assertEntityPresent(minecartEntityType, startPos);
  test.assertEntityNotPresent(minecartEntityType, endPos);

  test.pressButton(new BlockLocation(0, 3, 0));

  test.succeedWhenEntityPresent(minecartEntityType, endPos);
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("MinecartTests", "furnace_corner", (test) => {
  const furnaceMinecart = "furnace_minecart";

  const endPos = new BlockLocation(2, 2, 1);
  const startPos = new BlockLocation(1, 2, 0);

  test.assertEntityPresent(furnaceMinecart, startPos);

  test.succeedWhenEntityPresent(furnace_minecart, endPos);
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //furnace_minecart doesn't exist in bedrock

GameTest.register("MinecartTests", "detector_rail_slope", (test) => {
  const poweredDetectorPos = new BlockLocation(2, 2, 1);
  const ascendingSouth = 5;
  test.assertBlockTypePresent(BlockTypes.detectorRail, poweredDetectorPos);
  test.assertBlockState("rail_direction", ascendingSouth, poweredDetectorPos);

  test.pressButton(new BlockLocation(0, 3, 3));
  test.runAfterDelay(20, () => {
    test.succeedWhen(() => {
      test.assertBlockTypePresent(BlockTypes.detectorRail, poweredDetectorPos);
      test.assertBlockState("rail_direction", ascendingSouth, poweredDetectorPos);
    });
  });
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("MinecartTests", "detector_rail_piston", (test) => {
  const pistonRight = new BlockLocation(5, 3, 0);
  const pistonLeft = new BlockLocation(0, 3, 0);
  const torchRight = new BlockLocation(3, 2, 0);
  const torchLeft = new BlockLocation(2, 2, 0);
  const ascendingNorth = 4;

  let minecart = undefined;
  test
    .startSequence()
    .thenExecute(() => test.pulseRedstone(pistonRight, 1))
    .thenExecuteAfter(3, () => test.pulseRedstone(pistonLeft, 1))
    .thenExecuteAfter(3, () => {
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchRight);
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchLeft);
      minecart = test.spawn("minecart", new BlockLocation(3, 3, 1));
    })
    .thenExecuteAfter(3, () => {
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchRight);
      test.pulseRedstone(pistonRight, 1);
    })
    .thenExecuteAfter(7, () => {
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchRight);
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchLeft);
      test.pulseRedstone(pistonLeft, 1);
    })
    .thenExecuteAfter(7, () => {
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchRight);
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchLeft);
      minecart.kill();
    })
    .thenExecuteAfter(6, () => {
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchRight);
      test.assertBlockState("torch_facing_direction", ascendingNorth, torchLeft);
    })
    .thenSucceed();
})
  .required(false)
  .tag(GameTest.Tags.suiteDefault);

function runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, entityType) {
  test.assertEntityNotPresent(entityType, dryTrackEndPos);
  test.assertEntityNotPresent(entityType, wetTrackEndPos);

  test.pressButton(buttonPos);

  test
    .startSequence()
    .thenWait(() => test.assertEntityPresent(entityType, dryTrackEndPos))
    .thenExecute(() => test.assertEntityNotPresent(entityType, wetTrackEndPos))
    .thenWait(() => test.assertEntityPresent(entityType, wetTrackEndPos))
    .thenSucceed();
}

function runWaterSlowdown(test, entityType) {
  const buttonPos = new BlockLocation(1, 4, 2);
  const dryTrackEndPos = new BlockLocation(8, 3, 1);
  const wetTrackEndPos = new BlockLocation(8, 3, 3);

  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, entityType);
}

GameTest.register("MinecartTests", "water_slowdown", (test) => {
  runWaterSlowdown(test, "minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_occupied_cart", (test) => {
  runWaterSlowdown(test, "minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_tnt_cart", (test) => {
  runWaterSlowdown(test, "tnt_minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the tnt_minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_hopper_cart", (test) => {
  runWaterSlowdown(test, "hopper_minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the hopper_minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_chest_cart", (test) => {
  runWaterSlowdown(test, "chest_minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the chest_minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_commandblock_cart", (test) => {
  runWaterSlowdown(test, "command_block_minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the command_block_minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_powered_furnace_cart", (test) => {
  const buttonPos = new BlockLocation(1, 4, 4);
  const dryTrackEndPos = new BlockLocation(7, 3, 1);
  const wetTrackEndPos = new BlockLocation(7, 3, 7);
  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, "furnace_minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //furnace_minecart doesn't exist in bedrock

GameTest.register("MinecartTests", "water_slowdown_vertical", (test) => {
  const buttonPos = new BlockLocation(1, 6, 2);
  const dryTrackEndPos = new BlockLocation(3, 2, 1);
  const wetTrackEndPos = new BlockLocation(3, 2, 3);
  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, "minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_vertical_furnace", (test) => {
  const buttonPos = new BlockLocation(1, 6, 2);
  const dryTrackEndPos = new BlockLocation(3, 2, 1);
  const wetTrackEndPos = new BlockLocation(3, 2, 3);
  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, "furnace_minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //furnace_minecart doesn't exist in bedrock

GameTest.register("MinecartTests", "water_slowdown_slope_down", (test) => {
  const buttonPos = new BlockLocation(1, 6, 2);
  const dryTrackEndPos = new BlockLocation(6, 2, 1);
  const wetTrackEndPos = new BlockLocation(6, 2, 3);
  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, "minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_slope_down_furnace", (test) => {
  const buttonPos = new BlockLocation(1, 6, 2);
  const dryTrackEndPos = new BlockLocation(6, 2, 1);
  const wetTrackEndPos = new BlockLocation(6, 2, 3);
  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, "furnace_minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //furnace_minecart doesn't exist in bedrock

GameTest.register("MinecartTests", "water_slowdown_slope_up", (test) => {
  const buttonPos = new BlockLocation(1, 3, 1);
  const dryTrackEndPos = new BlockLocation(7, 5, 0);
  const wetTrackEndPos = new BlockLocation(7, 5, 2);
  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, "minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_powered_rail", (test) => {
  const buttonPos = new BlockLocation(1, 3, 1);
  const dryTrackEndPos = new BlockLocation(7, 5, 0);
  const wetTrackEndPos = new BlockLocation(7, 5, 2);
  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, "minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //the minecart cannot slow down in water.

GameTest.register("MinecartTests", "water_slowdown_powered_rail_furnace", (test) => {
  const buttonPos = new BlockLocation(1, 3, 1);
  const dryTrackEndPos = new BlockLocation(7, 2, 0);
  const wetTrackEndPos = new BlockLocation(7, 2, 2);
  runWaterSlowdownTest(test, buttonPos, dryTrackEndPos, wetTrackEndPos, "furnace_minecart");
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //furnace_minecart doesn't exist in bedrock
