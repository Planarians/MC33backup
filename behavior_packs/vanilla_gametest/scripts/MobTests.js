import * as GameTest from "GameTest";
import GameTestExtensions from "./GameTestExtensions.js";

import { BlockLocation, Effects, BlockTypes } from "Minecraft";

const TicksPerSecond = 20;

GameTest.register("MobTests", "zombie_burn", (test) => {
  const zombieEntityType = "minecraft:zombie";
  const zombiePosition = new BlockLocation(1, 2, 1);

  test.succeedWhenEntityNotPresent(zombieEntityType, zombiePosition);
})
  .maxTicks(TicksPerSecond * 30)
  .tag(GameTest.Tags.suiteDefault)
  .batch("day");

GameTest.register("MobTests", "effect_durations_longer_first", (test) => {
  const villagerId = "minecraft:villager_v2";
  const villagerPos = new BlockLocation(1, 2, 1);
  const buttonPos = new BlockLocation(1, 4, 0);
  const strongPotion = new BlockLocation(0, 4, 0);
  const weakPotion = new BlockLocation(2, 4, 0);

  test.spawn(villagerId, villagerPos);

  test
    .startSequence()
    .thenExecute(() => test.setBlockType(BlockTypes.air, weakPotion))
    .thenExecuteAfter(4, () => test.pressButton(buttonPos))
    .thenWait(() => test.assertBlockState("button_pressed_bit", 0, buttonPos))
    .thenExecute(() => test.setBlockType(BlockTypes.air, strongPotion))
    .thenExecuteAfter(4, () => test.pressButton(buttonPos))
    .thenIdle(41)
    .thenWait(() => {
      test.assertEntityData(
        villagerPos,
        villagerId,
        (entity) => entity.getEffect(Effects.regeneration).getAmplifier() == 0
      ); // Strength level I
      test.assertEntityData(
        villagerPos,
        villagerId,
        (entity) => entity.getEffect(Effects.regeneration).getDuration() > 120
      ); // At least 6 seconds remaining
    })
    .thenSucceed();
})
  .structureName("MobTests:effect_durations")
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); // Potions don't explode when shot from dispensers

GameTest.register("MobTests", "drowning_test", (test) => {
  const villagerEntitySpawnType = "minecraft:villager_v2";
  const pigSpawnType = "minecraft:pig";

  test.spawn(villagerEntitySpawnType, new BlockLocation(3, 2, 2));
  test.spawn(pigSpawnType, new BlockLocation(3, 2, 4));
  test.succeedWhen(() => {
    test.assertEntityNotPresentInArea(pigSpawnType);
    test.assertEntityNotPresentInArea(villagerEntitySpawnType);
  });
})
  .maxTicks(TicksPerSecond * 45)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("MobTests", "golem_vs_pillager", (test) => {
  const ironGolem = "minecraft:iron_golem";
  const pillager = "minecraft:pillager";
  const ironGolemPos = new BlockLocation(3, 2, 3);
  const pillagerPos = new BlockLocation(3, 2, 4);

  test.spawn(ironGolem, ironGolemPos);
  test.spawn(pillager, pillagerPos);

  test.succeedWhen(() => {
    test.assertEntityNotPresent(pillager, ironGolemPos);
    test.assertEntityPresent(ironGolem, pillagerPos);
  });
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("MobTests", "effect_durations_stronger_first", (test) => {
  const villagerId = "minecraft:villager_v2";
  const villagerPos = new BlockLocation(1, 2, 1);
  const buttonPos = new BlockLocation(1, 4, 0);
  const strongPotion = new BlockLocation(0, 4, 0);
  const weakPotion = new BlockLocation(2, 4, 0);

  test.spawn(villagerId, villagerPos);

  test
    .startSequence()
    .thenExecute(() => test.setBlockType(BlockTypes.air, strongPotion))
    .thenExecuteAfter(4, () => test.pressButton(buttonPos))
    .thenWait(() => test.assertBlockState("button_pressed_bit", 0, buttonPos))
    .thenExecute(() => test.setBlockType(BlockTypes.air, weakPotion))
    .thenExecuteAfter(4, () => test.pressButton(buttonPos))
    .thenIdle(41)
    .thenWait(() => {
      test.assertEntityData(
        villagerPos,
        villagerId,
        (entity) => entity.getEffect(Effects.regeneration).getAmplifier() == 0
      ); // Strength level I
      test.assertEntityData(
        villagerPos,
        villagerId,
        (entity) => entity.getEffect(Effects.regeneration).getDuration() > 120
      ); // At least 6 seconds remaining
    })
    .thenSucceed();
})
  .structureName("MobTests:effect_durations")
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); // Potions don't explode when shot from dispensers

GameTest.register("MobTests", "silverfish_no_suffocate", (test) => {
  const silverfishPos = new BlockLocation(1, 2, 1);
  const silverfish = "minecraft:silverfish";

  test
    .startSequence()
    .thenExecute(() => test.assertEntityHasComponent(silverfish, "minecraft:health", silverfishPos, true))
    .thenIdle(40)
    .thenExecute(() => test.assertEntityHasComponent(silverfish, "minecraft:health", silverfishPos, true))
    .thenSucceed();
  test
    .startSequence()
    .thenWait(() => test.assertEntityNotPresent(silverfish, silverfishPos))
    .thenFail("Silverfish died");
})
  .maxTicks(TicksPerSecond * 30)
  .required(false)
  .tag(GameTest.Tags.suiteDefault);
