import * as GameTest from "GameTest";
import { BlockLocation } from "Minecraft";

GameTest.register("SmallMobTests", "fence_corner", (test) => {
    const piglinEntityType = "minecraft:piglin<minecraft:entity_born>";
    const entityLoc = new BlockLocation(1, 2, 1);
    const piglin = test.spawnWithoutBehaviors(piglinEntityType, entityLoc);
		
    const targetPos = new BlockLocation(3, 2, 3);
    test.walkTo(piglin, targetPos, 1);
    test.succeedWhenEntityPresent(piglinEntityType, targetPos);
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("SmallMobTests", "fence_side", (test) => {
    const piglinEntityType = "minecraft:piglin<minecraft:entity_born>";
    const entityLoc = new BlockLocation(2, 2, 2);
    const piglin = test.spawnWithoutBehaviors(piglinEntityType, entityLoc);
	
    const targetPos = new BlockLocation(0, 2, 2);
    test.walkTo(piglin, targetPos, 1);
    test.succeedWhenEntityPresent(piglinEntityType, targetPos);
    test.runAfterDelay(10, () => {
        test.succeedWhenEntityNotPresent(piglinEntityType, targetPos);
    })
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("SmallMobTests", "fence_post", (test) => { 
    const chickenEntityType = "minecraft:chicken";
    const entityLoc = new BlockLocation(1, 2, 1);
    const chicken = test.spawnWithoutBehaviors(chickenEntityType, entityLoc);

    const targetPos = new BlockLocation(3, 2, 3);
    test.walkTo(chicken, targetPos, 1);
    test.succeedWhenEntityPresent(chickenEntityType, targetPos);
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); //game parity,the chicken cannot walk between the fenceposts
