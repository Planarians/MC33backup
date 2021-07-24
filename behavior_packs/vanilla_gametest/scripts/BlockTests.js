import * as GameTest from "GameTest";
import { BlockLocation, BlockTypes, Items, ItemStack } from "Minecraft";

const TicksPerSecond = 20;
const FiveSecondsInTicks = 5 * TicksPerSecond;

const FALLING_SAND_TEMPLATE_NAME = "BlockTests:falling_sand_template";
const FALLING_SAND_STARTUP_TICKS = 1;
const FALLING_SAND_TIMEOUT_TICKS = 20;

const BLOCKS_THAT_POP_SAND = [
  [BlockTypes.woodenSlab, BlockTypes.air], //replace missing oakSlab() with woodenSlab()
  [BlockTypes.chest, BlockTypes.stone],
  [BlockTypes.rail, BlockTypes.stone],
  [BlockTypes.stoneButton, BlockTypes.stone],
  [BlockTypes.woodenPressurePlate, BlockTypes.stone], //replace missing OakPressurePlate() with woodenPressurePlate()
  [BlockTypes.torch, BlockTypes.stone],
  [BlockTypes.soulSand, BlockTypes.air],
];

const BLOCKS_REPLACED_BY_SAND = [
  BlockTypes.water,
  BlockTypes.air,
  BlockTypes.tallgrass, //replace grass() with tallgrass(). It needs grass, not grass block, BlockTypes.grass is actually grass block.
];

const BLOCKS_THAT_SUPPORT_SAND = [
  BlockTypes.stone,
  BlockTypes.fence, //replace missing oakFence() with fence()
  BlockTypes.oakStairs,
  BlockTypes.scaffolding,
];

function testThatFallingSandPopsIntoItem(test) {
  test.setBlockType(BlockTypes.sand, new BlockLocation(1, 4, 1));
  const targetPos = new BlockLocation(1, 2, 1);

  test.succeedWhen(() => {
    test.assertEntityPresentInArea("minecraft:item");
    test.assertEntityNotPresent("minecraft:falling_block", targetPos);
  });
}

function testThatFallingSandReplaces(test) {
  test.setBlockType(BlockTypes.sand, new BlockLocation(1, 4, 1));
  test.succeedWhenBlockTypePresent(BlockTypes.sand, new BlockLocation(1, 2, 1));
}

function testThatFallingSandLandsOnTop(test) {
  test.setBlockType(BlockTypes.sand, new BlockLocation(1, 4, 1));
  test.succeedWhenBlockTypePresent(BlockTypes.sand, new BlockLocation(1, 3, 1));
}

///
// Concrete Tests
///
for (let i = 0; i < BLOCKS_THAT_POP_SAND.length; i++) {
  const topBlock = BLOCKS_THAT_POP_SAND[i][0];
  const bottomBlock = BLOCKS_THAT_POP_SAND[i][1];
  const testName = "blocktests.falling_sand_pops_on_" + topBlock.name;
  let tag = null;

  //When sand block falls on soul sand, it should pop into item.
  //Buttons will break off if they face the worng direction. Wait API that can set the block property for "direction" for the button.
  if (topBlock.name == "soul_sand" || topBlock.name == "stone_button") {
    tag = GameTest.Tags.suiteDisabled;
  } else {
    tag = GameTest.Tags.suiteDefault;
  }

  GameTest.register("BlockTests", testName, (test) => {
    test.setBlockType(topBlock, new BlockLocation(1, 2, 1));
    test.setBlockType(bottomBlock, new BlockLocation(1, 1, 1));
    testThatFallingSandPopsIntoItem(test);
  })
    .batch("day")
    .structureName(FALLING_SAND_TEMPLATE_NAME)
    .maxTicks(FALLING_SAND_TIMEOUT_TICKS)
    .setupTicks(FALLING_SAND_STARTUP_TICKS)
    .required(true)
    .tag(tag);
}

for (const block of BLOCKS_REPLACED_BY_SAND) {
  const testName = "blocktests.falling_sand_replaces_" + block.name;

  GameTest.register("BlockTests", testName, (test) => {
    //SetBlock will fail if set a block to what it already is. Skip to call setblock() for test falling_sand_replaces_air because it's just air block in initial structure.
    if (block.name != "air") {
      test.setBlockType(block, new BlockLocation(1, 2, 1));
    }
    testThatFallingSandReplaces(test);
  })
    .batch("day")
    .structureName(FALLING_SAND_TEMPLATE_NAME)
    .maxTicks(FALLING_SAND_TIMEOUT_TICKS)
    .setupTicks(FALLING_SAND_STARTUP_TICKS)
    .required(true)
    .tag(GameTest.Tags.suiteDefault);
}

for (const block of BLOCKS_THAT_SUPPORT_SAND) {
  const testName = "blocktests.falling_sand_lands_on_" + block.name;
  let tag = null;

  //When sand block falls on fence or stair, it shouldn't pop into item.
  if (block.name == "fence" || block.name == "oak_stairs") {
    tag = GameTest.Tags.suiteDisabled;
  } else {
    tag = GameTest.Tags.suiteDefault;
  }

  GameTest.register("BlockTests", testName, (test) => {
    test.setBlockType(block, new BlockLocation(1, 2, 1));
    testThatFallingSandLandsOnTop(test);
  })
    .batch("day")
    .structureName(FALLING_SAND_TEMPLATE_NAME)
    .maxTicks(FALLING_SAND_TIMEOUT_TICKS)
    .setupTicks(FALLING_SAND_STARTUP_TICKS)
    .required(true)
    .tag(tag);
}

GameTest.register("BlockTests", "concrete_solidifies_in_shallow_water", (test) => {
  test.setBlockType(BlockTypes.concretepowder, new BlockLocation(1, 3, 1));

  test.succeedWhen(() => {
    test.assertBlockTypePresent(BlockTypes.concrete, new BlockLocation(1, 2, 1));
  });
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "concrete_solidifies_in_deep_water", (test) => {
  test.setBlockType(BlockTypes.concretepowder, new BlockLocation(1, 4, 1));

  test.succeedWhen(() => {
    test.assertBlockTypePresent(BlockTypes.concrete, new BlockLocation(1, 2, 1));
  });
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "concrete_solidifies_next_to_water", (test) => {
  test.setBlockType(BlockTypes.concretepowder, new BlockLocation(1, 3, 1));

  test.succeedWhen(() => {
    test.assertBlockTypePresent(BlockTypes.concrete, new BlockLocation(1, 2, 1));
  });
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "sand_fall_boats", (test) => {
  test.setBlockType(BlockTypes.sand, new BlockLocation(1, 4, 1));

  test.succeedWhen(() => {
    test.assertBlockTypePresent(BlockTypes.sand, new BlockLocation(1, 2, 1));
  });
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "sand_fall_shulker", (test) => {
  const EntitySpawnType = "minecraft:shulker";
  const spawnPos = new BlockLocation(1, 2, 1);

  test.spawn(EntitySpawnType, spawnPos);
  testThatFallingSandPopsIntoItem(test);
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

///
// Turtle Egg Tests
///

GameTest.register("BlockTests", "turtle_eggs_survive_xp", (test) => {
  const xpOrb = "minecraft:xp_orb";
  const spawnPos = new BlockLocation(1, 3, 1);

  for (let i = 0; i < 8; i++) {
    test.spawn(xpOrb, spawnPos);
  }

  // Fail if the turtle egg dies
  test.failIf(() => {
    test.assertBlockTypePresent(BlockTypes.air, new BlockLocation(1, 2, 1));
  });

  // Succeed after 4 seconds
  test.startSequence().thenIdle(80).thenSucceed();
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "turtle_eggs_survive_item", (test) => {
  test.pressButton(new BlockLocation(2, 4, 0));

  // Fail if the turtle egg dies
  test.failIf(() => {
    test.assertBlockTypePresent(BlockTypes.air, new BlockLocation(1, 2, 1));
  });

  // Succeed after 4 seconds
  test.startSequence().thenIdle(80).thenSucceed();
})
  .maxTicks(FiveSecondsInTicks)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "turtle_eggs_squished_by_mob", (test) => {
  const zombieEntityType = "minecraft:husk";
  const zombiePosition = new BlockLocation(1, 5, 1);
  test.spawn(zombieEntityType, zombiePosition);
  test.succeedWhenBlockTypePresent(BlockTypes.air, new BlockLocation(1, 2, 1));
})
  .required(false)
  .maxTicks(TicksPerSecond * 20)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "explosion_drop_location", (test) => {
  test.pressButton(new BlockLocation(4, 3, 4));

  test.succeedWhen(() => {
    const redSandstonePos = new BlockLocation(6, 2, 4);
    const sandstonePos = new BlockLocation(2, 2, 4);

    test.assertBlockTypeNotPresent(BlockTypes.redSandstone, redSandstonePos);
    test.assertBlockTypeNotPresent(BlockTypes.sandstone, sandstonePos);
    test.assertItemEntityPresent(Items.redSandstone, redSandstonePos, 2.0);
    test.assertItemEntityPresent(Items.sandstone, sandstonePos, 2.0);
  });
})
  .maxTicks(TicksPerSecond * 10)
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled) //redSandstone and sandstone items should be present.
  .maxAttempts(3);

GameTest.register("BlockTests", "concrete_pops_off_waterlogged_chest", (test) => {
  test.setBlockType(BlockTypes.concretepowder, new BlockLocation(1, 4, 1));
  test.succeedWhen(() => {
    const chestPos = new BlockLocation(1, 2, 1);
    test.assertBlockTypePresent(BlockTypes.chest, chestPos);
    test.assertItemEntityPresent(Items.concretePowder, chestPos, 2);
    test.assertEntityNotPresentInArea("falling_block");
  });
})
  .maxTicks(TicksPerSecond * 5)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("BlockTests", "waterlogged_slab", (test) => {
  const slabPos = new BlockLocation(1, 1, 1);
  test.assertIsWaterlogged(slabPos, false);
  test.succeedWhen(() => {
    test.assertIsWaterlogged(slabPos, true);
  });
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled) // Slab should be waterlogged
  .maxTicks(TicksPerSecond * 2);
