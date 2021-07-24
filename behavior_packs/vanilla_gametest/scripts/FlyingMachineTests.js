import * as GameTest from "GameTest";
import { BlockLocation, BlockTypes } from "Minecraft";

GameTest.register("FlyingMachineTests", "machine_a", (test) => {
  const triggerPos = new BlockLocation(1, 5, 1);
  const farPos = new BlockLocation(2, 3, 5);
  const nearPos = new BlockLocation(2, 3, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.setBlockType(BlockTypes.fire, triggerPos);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.slime, farPos);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.slime, nearPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity") // The behavior is different between Java and Bedrock.In Java the flying machine move forward to the end and then returns to its original position, but in Bedrock it returns before it reaches the end.That cause the far point or near point been judged fail.
  .tag(GameTest.Tags.suiteDisabled); // Unstable, about 50% pass rate.

GameTest.register("FlyingMachineTests", "machine_b", (test) => {
  const triggerPos = new BlockLocation(5, 4, 1);
  const farPos = new BlockLocation(3, 3, 4);
  const nearPos = new BlockLocation(4, 3, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.pulseRedstone(triggerPos, 2);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.slime, farPos);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.slime, nearPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); // After I use redstone instead of set fire block to active the observer, I can see this machine use 2 reverse sticky-piston for flying forward and back in Java. It didn't work well in bedrock.

GameTest.register("FlyingMachineTests", "machine_c", (test) => {
  const triggerPos = new BlockLocation(4, 4, 0);
  const farPos = new BlockLocation(4, 3, 5);
  const nearPos = new BlockLocation(4, 3, 2);
  const stopBlock = new BlockLocation(4, 3, 4);

  test
    .startSequence()
    .thenExecute(() => {
      test.pulseRedstone(triggerPos, 2);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.slime, farPos);
    })
    .thenExecuteAfter(20, () => {
      test.setBlockType(BlockTypes.obsidian, stopBlock);
    })
    .thenExecuteAfter(2, () => {
      test.assertBlockTypePresent(BlockTypes.stickyPiston, nearPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); // Could not set fire block in the air even I use pulseRedstone() the machine didn't move.

GameTest.register("FlyingMachineTests", "machine_d", (test) => {
  const triggerPos = new BlockLocation(3, 7, 3);
  const dropPos = new BlockLocation(5, 5, 2);
  const farPos = new BlockLocation(2, 5, 8);
  const nearPos = new BlockLocation(3, 5, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.setBlockType(BlockTypes.fire, triggerPos);
    })
    .thenExecuteAfter(16, () => {
      test.assertBlockTypePresent(BlockTypes.slime, dropPos);
      test.assertBlockTypePresent(BlockTypes.slime, farPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); // Can't fly as a whole thing as expectation

GameTest.register("FlyingMachineTests", "machine_e", (test) => {
  const triggerPos = new BlockLocation(1, 2, 1);
  const farPos = new BlockLocation(1, 11, 1);
  const nearPos = new BlockLocation(1, 3, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.setBlockType(BlockTypes.dirt, triggerPos);
    })
    .thenExecuteAfter(16, () => {
      test.assertBlockTypePresent(BlockTypes.honeyBlock, farPos);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.observer, nearPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity") // The behavior is different between Java and Bedrock. In Java the flying machine move forward to the end and then returns to its original position, but in Bedrock it returns before it reaches the end. That cause the far point or near point been judged fail.
  .tag(GameTest.Tags.suiteDisabled); // Unstable

GameTest.register("FlyingMachineTests", "machine_f", (test) => {
  const triggerPos = new BlockLocation(4, 6, 1);
  const farPos = new BlockLocation(3, 4, 8);
  const dropPos = new BlockLocation(3, 4, 6);
  const nearPos = new BlockLocation(3, 4, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.setBlockType(BlockTypes.fire, triggerPos);
    })
    .thenExecuteAfter(18, () => {
      test.assertBlockTypePresent(BlockTypes.slime, farPos);
    })
    .thenExecuteAfter(40, () => {
      test.assertBlockTypePresent(BlockTypes.slime, dropPos);
      test.assertBlockTypePresent(BlockTypes.slime, nearPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); // Unstable, when noFinishingSequence appears, it failed.

GameTest.register("FlyingMachineTests", "machine_g", (test) => {
  const triggerPos = new BlockLocation(1, 3, 0);
  const farPos = new BlockLocation(2, 3, 6);
  const nearPos = new BlockLocation(1, 3, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.pulseRedstone(triggerPos, 2);
    })
    .thenExecuteAfter(16, () => {
      test.assertBlockTypePresent(BlockTypes.slime, farPos);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.observer, nearPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); // Could not set fire in the air, so I use pulseRedstone to active the observer. It's 50% pass rate.

GameTest.register("FlyingMachineTests", "machine_h", (test) => {
  const triggerPos = new BlockLocation(1, 4, 0);
  const farPos = new BlockLocation(1, 3, 8);
  const dropPos = new BlockLocation(1, 3, 7);
  const nearPos = new BlockLocation(1, 4, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.pulseRedstone(triggerPos, 2);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.slime, farPos);
    })
    .thenExecuteAfter(20, () => {
      test.assertBlockTypePresent(BlockTypes.slime, dropPos);
      test.assertBlockTypePresent(BlockTypes.observer, nearPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity")
  .tag(GameTest.Tags.suiteDisabled); // Could not set fire in the air, so I use pulseRedstone to active the observer, pass rate is less than 10%, the sticky-piston always unstick.

GameTest.register("FlyingMachineTests", "machine_i", (test) => {
  const triggerPos = new BlockLocation(4, 2, 1);
  const farPos = new BlockLocation(3, 8, 1);
  const nearPos = new BlockLocation(4, 3, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.setBlockType(BlockTypes.dirt, triggerPos);
    })
    .thenExecuteAfter(18, () => {
      test.assertBlockTypePresent(BlockTypes.honeyBlock, farPos);
    })
    .thenExecuteAfter(18, () => {
      test.assertBlockTypePresent(BlockTypes.observer, nearPos);
    })
    .thenSucceed();
})
  .tag("suite:java_parity") // The behavior is different between Java and Bedrock. In Java the flying machine move forward to the end and then returns to its original position, but in Bedrock it returns before it reaches the end. That cause the far point or near point been judged fail.
  .tag(GameTest.Tags.suiteDisabled); // Unstable.

GameTest.register("FlyingMachineTests", "m_bedrock", (test) => {
  // For bedrock. Follow the simple engine 1
  const triggerPos = new BlockLocation(0, 3, 0);
  const sourcePos = new BlockLocation(1, 3, 0);
  const targetPos = new BlockLocation(8, 3, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.assertBlockTypePresent(BlockTypes.slime, sourcePos);
      test.assertBlockTypeNotPresent(BlockTypes.slime, targetPos);
      test.setBlockType(BlockTypes.redstoneBlock, triggerPos);
    })
    .thenExecuteAfter(10, () => {
      test.assertBlockTypeNotPresent(BlockTypes.slime, sourcePos);
    })
    .thenExecuteAfter(10, () => {
      test.assertBlockTypePresent(BlockTypes.slime, targetPos);
    })
    .thenSucceed();
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("FlyingMachineTests", "m2_bedrock", (test) => {
  // For bedrock. Follow the simple engine 2
  const triggerPos = new BlockLocation(0, 3, 1);
  const sourcePos = new BlockLocation(2, 3, 0);
  const targetPos = new BlockLocation(6, 3, 1);

  test
    .startSequence()
    .thenExecute(() => {
      test.assertBlockTypePresent(BlockTypes.slime, sourcePos);
      test.assertBlockTypeNotPresent(BlockTypes.slime, targetPos);
      test.setBlockType(BlockTypes.redstoneBlock, triggerPos);
    })
    .thenExecuteAfter(10, () => {
      test.assertBlockTypeNotPresent(BlockTypes.slime, sourcePos);
    })
    .thenExecuteAfter(10, () => {
      test.assertBlockTypePresent(BlockTypes.slime, targetPos);
    })
    .thenSucceed();
}).tag(GameTest.Tags.suiteDefault);

GameTest.register("FlyingMachineTests", "m3_bedrock", (test) => {
  // for bedrock. Follow the simple engine 2 with trailer
  const triggerPos = new BlockLocation(1, 3, 2);
  const sourcePos = new BlockLocation(4, 3, 2);
  const targetPos = new BlockLocation(7, 3, 2);

  test
    .startSequence()
    .thenExecute(() => {
      test.assertBlockTypePresent(BlockTypes.slime, sourcePos);
      test.assertBlockTypeNotPresent(BlockTypes.slime, targetPos);
      test.setBlockType(BlockTypes.redstoneBlock, triggerPos);
    })
    .thenExecuteAfter(10, () => {
      test.assertBlockTypeNotPresent(BlockTypes.slime, sourcePos);
    })
    .thenExecuteAfter(10, () => {
      test.assertBlockTypePresent(BlockTypes.slime, targetPos);
    })
    .thenSucceed();
}).tag(GameTest.Tags.suiteDisabled); // Unstable, the pass rate is 85%
