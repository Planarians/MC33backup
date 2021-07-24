import * as GameTest from "GameTest";
import { BlockLocation, BlockTypes, ExplosionOptions, Effects, Items, ItemStack, Location, World } from "Minecraft";

GameTest.register("APITests", "on_entity_created", (test) => {
  const entityCreatedCallback = World.events.createEntity.subscribe((entity) => {
    if (entity) {
      test.succeed();
    } else {
      test.fail("Expected entity");
    }
  });
  test.spawn("minecraft:horse<minecraft:ageable_grow_up>", new BlockLocation(1, 2, 1));
  World.events.createEntity.unsubscribe(entityCreatedCallback);
})
  .structureName("ComponentTests:animal_pen")
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "assert_is_waterlogged", (test) => {
  const waterChestLoc = new BlockLocation(5, 2, 1);
  const waterLoc = new BlockLocation(4, 2, 1);
  const chestLoc = new BlockLocation(2, 2, 1);
  const airLoc = new BlockLocation(1, 2, 1);

  test.assertIsWaterlogged(waterChestLoc, true);
  test.assertIsWaterlogged(waterLoc, false);
  test.assertIsWaterlogged(chestLoc, false);
  test.assertIsWaterlogged(airLoc, false);
  test.succeed();
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "assert_redstone_power", (test) => {
  const redstoneBlockLoc = new BlockLocation(3, 2, 1);
  const redstoneTorchLoc = new BlockLocation(2, 2, 1);
  const poweredLampLoc = new BlockLocation(1, 2, 1);
  const unpoweredLampLoc = new BlockLocation(0, 2, 1);
  const airLoc = new BlockLocation(3, 2, 0);
  const redstoneWireLoc = new BlockLocation(0, 1, 0);

  test.succeedWhen(() => {
    test.assertRedstonePower(redstoneBlockLoc, 15);
    test.assertRedstonePower(redstoneTorchLoc, 15);
    test.assertRedstonePower(poweredLampLoc, 15);
    test.assertRedstonePower(unpoweredLampLoc, 0);
    test.assertRedstonePower(airLoc, -1);
    test.assertRedstonePower(redstoneWireLoc, 13); // 3 length wire
  });
})
  .maxTicks(20)
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "spawn_item", (test) => {
  const featherItem = new ItemStack(Items.feather, 1, 0);
  test.spawnItem(featherItem, new Location(1.5, 3.5, 1.5));
  test.succeedWhen(() => {
    test.assertEntityPresent("minecraft:item", new BlockLocation(1, 2, 1));
  });
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "assert_entity_data", (test) => {
  const pigId = "minecraft:pig<minecraft:ageable_grow_up>";
  const pigLoc = new BlockLocation(1, 2, 1);
  test.spawn(pigId, pigLoc);
  test.succeedWhen(() => {
    test.assertEntityData(pigLoc, pigId, (entity) => entity.id !== undefined);
  });
})
  .structureName("ComponentTests:animal_pen")
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "add_effect", (test) => {
  const villagerId = "minecraft:villager_v2<minecraft:ageable_grow_up>";
  const villagerLoc = new BlockLocation(1, 2, 1);
  const villager = test.spawn(villagerId, villagerLoc);
  const duration = 20;
  villager.addEffect(Effects.poison, duration, 1);

  test.assertEntityData(villagerLoc, villagerId, (entity) => entity.getEffect(Effects.poison).duration == duration);
  test.assertEntityData(villagerLoc, villagerId, (entity) => entity.getEffect(Effects.poison).amplifier == 1);

  test.runAfterDelay(duration, () => {
    test.assertEntityData(villagerLoc, villagerId, (entity) => entity.getEffect(Effects.poison) === undefined);
    test.succeed();
  });
})
  .structureName("ComponentTests:animal_pen")
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "assert_entity_present", (test) => {
  const villagerId = "minecraft:villager_v2";
  const villagerLoc = new BlockLocation(1, 2, 3);
  const emeraldItem = new ItemStack(Items.emerald, 1, 0);
  const emeraldItemLoc = new BlockLocation(3, 2, 3);
  const minecartId = "minecraft:minecart";
  const minecartLoc = new BlockLocation(3, 2, 1);
  const armorStandId = "minecraft:armor_stand";
  const armorStandLoc = new BlockLocation(1, 2, 1);

  test.spawn(villagerId, villagerLoc);
  test.spawnItem(emeraldItem, new Location(3.5, 4.5, 3.5));

  test.succeedWhen(() => {
    test.assertEntityPresent(villagerId, villagerLoc);
    test.assertItemEntityPresent(Items.emerald, emeraldItemLoc, 0);
    test.assertEntityPresent(armorStandId, armorStandLoc);

    // Check all blocks surrounding the minecart
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        let offsetLoc = new BlockLocation(minecartLoc.x + x, minecartLoc.y, minecartLoc.z + z);
        if (x == 0 && z == 0) {
          test.assertEntityPresent(minecartId, offsetLoc);
        } else {
          test.assertEntityNotPresent(minecartId, offsetLoc);
        }
      }
    }
  });
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "assert_entity_not_present", (test) => {
  const armorStandId = "minecraft:armor_stand";
  const pigId = "minecraft:pig";
  const armorStandLoc = new BlockLocation(1, 2, 1);
  const airLoc = new BlockLocation(0, 2, 1);

  try {
    test.assertEntityNotPresentInArea(armorStandId);
    test.fail(); // this assert should throw
  } catch (e) {}

  try {
    test.assertEntityNotPresent(armorStandId, armorStandLoc);
    test.fail(); // this assert should throw
  } catch (e) {}

  test.assertEntityNotPresent(armorStandId, airLoc);
  test.assertEntityNotPresentInArea(pigId);

  test.succeed();
})
  .structureName("APITests:armor_stand")
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "assert_item_entity_count_is", (test) => {
  let oneItemLoc = new BlockLocation(3, 2, 1);
  let fiveItemsLoc = new BlockLocation(1, 2, 1);
  let noItemsLoc = new BlockLocation(2, 2, 1);
  let diamondPickaxeLoc = new BlockLocation(2, 2, 4);

  const oneEmerald = new ItemStack(Items.emerald, 1, 0);
  const onePickaxe = new ItemStack(Items.diamondPickaxe, 1, 0);
  const fiveEmeralds = new ItemStack(Items.emerald, 5, 0);

  test.spawnItem(oneEmerald, new Location(3.5, 3, 1.5));
  test.spawnItem(fiveEmeralds, new Location(1.5, 3, 1.5));

  // spawn 9 pickaxes in a 3x3 grid
  for (let x = 1.5; x <= 3.5; x++) {
    for (let z = 3.5; z <= 5.5; z++) {
      test.spawnItem(onePickaxe, new Location(x, 3, z));
    }
  }

  test.assertItemEntityCountIs(Items.emerald, noItemsLoc, 0, 0);

  test.succeedWhen(() => {
    test.assertItemEntityCountIs(Items.feather, oneItemLoc, 0, 0);
    test.assertItemEntityCountIs(Items.emerald, oneItemLoc, 0, 1);
    test.assertItemEntityCountIs(Items.feather, fiveItemsLoc, 0, 0);
    test.assertItemEntityCountIs(Items.emerald, fiveItemsLoc, 0, 5);
    test.assertItemEntityCountIs(Items.emerald, fiveItemsLoc, 0, 5);
    test.assertItemEntityCountIs(Items.diamondPickaxe, diamondPickaxeLoc, 1, 9);
    test.assertItemEntityCountIs(Items.diamondPickaxe, diamondPickaxeLoc, 0, 1);
  });
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "assert_entity_touching", (test) => {
  const armorStandId = "minecraft:armor_stand";

  test.assertEntityTouching(armorStandId, new Location(1.5, 2.5, 1.5));
  test.assertEntityTouching(armorStandId, new Location(1.5, 3.5, 1.5));
  test.assertEntityNotTouching(armorStandId, new Location(1.0, 2.5, 1.5));
  test.assertEntityNotTouching(armorStandId, new Location(2.0, 2.5, 1.5));
  test.assertEntityNotTouching(armorStandId, new Location(1.5, 2.5, 1.0));
  test.assertEntityNotTouching(armorStandId, new Location(1.5, 2.5, 2.0));

  test.succeed();
})
  .structureName("APITests:armor_stand")
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "pulse_redstone", (test) => {
  const pulseLoc = new BlockLocation(1, 2, 2);
  const lampLoc = new BlockLocation(1, 2, 1);
  test.assertRedstonePower(lampLoc, 0);
  test.pulseRedstone(pulseLoc, 2);

  test
    .startSequence()
    .thenIdle(2)
    .thenExecute(() => test.assertRedstonePower(lampLoc, 15))
    .thenIdle(1)
    .thenExecute(() => test.assertRedstonePower(lampLoc, 0))
    .thenSucceed();
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "location", (test) => {
  let testLoc = new BlockLocation(1, 1, 1);
  let worldLoc = test.worldLocation(testLoc);
  let relativeLoc = test.relativeLocation(worldLoc);
  test.assert(!relativeLoc.equals(worldLoc), "Expected relativeLoc and worldLoc to be different");
  test.assert(relativeLoc.equals(testLoc), "Expected relativeLoc to match testLoc");
  test.succeed();
})
  .structureName("ComponentTests:platform")
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "create_explosion_basic", (test) => {
  let overworld = World.getDimension("overworld");
  const center = new BlockLocation(2, 3, 2);

  test.assertBlockTypePresent(BlockTypes.cobblestone, center);

  const loc = test.worldLocation(center);
  const explosionLoc = new Location(loc.x + 0.5, loc.y + 0.5, loc.z + 0.5);
  overworld.createExplosion(explosionLoc, 10, new ExplosionOptions());

  for (let x = 1; x <= 3; x++) {
    for (let y = 2; y <= 4; y++) {
      for (let z = 1; z <= 3; z++) {
        test.assertBlockTypeNotPresent(BlockTypes.cobblestone, new BlockLocation(x, y, z));
      }
    }
  }

  test.succeed();
})
  .padding(10) // The blast can destroy nearby items and mobs
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "create_explosion_advanced", (test) => {
  let overworld = World.getDimension("overworld");
  const center = new BlockLocation(2, 3, 2);

  const pigId = "minecraft:pig<minecraft:ageable_grow_up>";
  const pigLoc = new BlockLocation(2, 4, 2);
  test.spawn(pigId, pigLoc);

  const loc = test.worldLocation(center);
  const explosionLoc = new Location(loc.x + 0.5, loc.y + 0.5, loc.z + 0.5);
  let explosionOptions = new ExplosionOptions();

  test.assertBlockTypePresent(BlockTypes.cobblestone, center);

  // Start by exploding without breaking blocks
  explosionOptions.breaksBlocks = false;
  const creeper = test.spawn("minecraft:creeper", new BlockLocation(1, 2, 1));
  explosionOptions.source = creeper;
  test.assertEntityPresent(pigId, pigLoc);
  overworld.createExplosion(explosionLoc, 10, explosionOptions);
  creeper.kill();
  test.assertEntityNotPresent(pigId, pigLoc);
  test.assertBlockTypePresent(BlockTypes.cobblestone, center);

  // Next, explode with fire
  explosionOptions = new ExplosionOptions();
  explosionOptions.causesFire = true;

  let findFire = () => {
    let foundFire = false;
    for (let x = 0; x <= 4; x++) {
      for (let z = 0; z <= 4; z++) {
        try {
          test.assertBlockTypePresent(BlockTypes.fire, new BlockLocation(x, 3, z));
          foundFire = true;
          break;
        } catch (e) {}
      }
    }
    return foundFire;
  };

  test.assert(!findFire(), "Unexpected fire");
  overworld.createExplosion(explosionLoc, 10, explosionOptions);
  test.assertBlockTypeNotPresent(BlockTypes.cobblestone, center);
  test.assert(findFire(), "No fire found");

  // Finally, explode in water
  explosionOptions.allowUnderwater = true;
  const belowWaterLoc = new BlockLocation(2, 1, 2);
  test.assertBlockTypeNotPresent(BlockTypes.air, belowWaterLoc);
  overworld.createExplosion(explosionLoc, 7, explosionOptions);
  test.assertBlockTypePresent(BlockTypes.air, belowWaterLoc);
  test.succeed();
})
  .padding(10) // The blast can destroy nearby items and mobs
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "triggerEvent", (test) => {
  const creeper = test.spawn("creeper", new BlockLocation(1, 2, 1));
  creeper.triggerEvent("minecraft:start_exploding_forced");

  test.succeedWhen(() => {
    test.assertEntityNotPresentInArea("creeper");
  });
})
  .structureName("ComponentTests:glass_cage")
  .tag(GameTest.Tags.suiteDefault);

GameTest.register("APITests", "chat", (test) => {
  test.print("subscribing");

  const chatCallback = World.events.beforeChat.subscribe((eventData) => {
    if (eventData.message === "!killme") {
      eventData.sender.kill();
      eventData.canceled = true;
    } else if (eventData.message === "!players") {
      test.print(`There are ${eventData.targets.length} players in the server.`);
      for (const target of eventData.targets) {
        test.print("Player: " + target.name);
      }
    } else {
      eventData.message = `Modified '${eventData.message}'`;
    }
  });

  test
    .startSequence()
    .thenIdle(200)
    .thenExecute(() => {
      World.events.beforeChat.unsubscribe(chatCallback);
      test.print("unsubscribed");
    })
    .thenSucceed();
})
  .structureName("ComponentTests:platform")
  .maxTicks(1000)
  .tag(GameTest.Tags.suiteDisabled);

GameTest.register("APITests", "add_effect_event", (test) => {
  const villagerId = "minecraft:villager_v2<minecraft:ageable_grow_up>";
  const villager = test.spawn(villagerId, new BlockLocation(1, 2, 1));

  const addEffectCallback = World.events.addEffect.subscribe((eventData) => {
    test.assert(eventData.entity.id === "minecraft:villager_v2", "Unexpected id");
    test.assert(eventData.effect.displayName === "Poison II", "Unexpected display name");
    test.assert(eventData.effectState === 1, "Unexpected effect state");
    test.succeed();
  });

  villager.addEffect(Effects.poison, 5, 1);
  World.events.beforeChat.unsubscribe(addEffectCallback);
})
  .structureName("ComponentTests:animal_pen")
  .tag(GameTest.Tags.suiteDefault);
