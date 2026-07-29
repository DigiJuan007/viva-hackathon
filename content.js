/*
 * VIVA SWAPPABLE CONTENT PACK
 * ---------------------------
 * This file is the activity. The rest of the app is the reusable shell.
 *
 * To swap in a different seven-day activity (for example, piano practice),
 * replace this file or edit VIVA_CONTENT_PACK below. Keep days 1 through 7,
 * and keep every day in this exact shape:
 *   { title, prompt, steps[], voiceScript, help }
 *
 * Change `id` whenever you ship a different week or activity. Viva uses that
 * id to keep the new pack's progress separate from an earlier pack.
 * voiceScript is read verbatim by the Listen feature. Write exactly what the
 * companion should say; the app never adds to or summarizes it.
 */

window.VIVA_CONTENT_PACK = {
  id: "companion-moment-week-1",
  name: "Companion Moment",
  days: {
    1: {
      title: "Arrive and Breathe",
      prompt: "Take a few quiet minutes to settle in, breathe gently, and welcome a favorite memory.",
      steps: [
        "Sit comfortably with both feet supported.",
        "Notice how you feel today, without needing to change anything.",
        "Take three easy breaths: in gently, then out slowly.",
        "Roll your shoulders slowly two times in each direction. Stop if anything feels uncomfortable.",
        "Think of a place that has made you feel peaceful.",
        "Play, sing, or hum part of a favorite song and enjoy the moment."
      ],
      voiceScript: "Welcome. This is your time. Sit in a way that feels comfortable, with your feet supported. Notice how you feel today. There is nothing you need to fix. Take an easy breath in, and let it out slowly. Again, breathe in gently, and breathe out. One more comfortable breath. If it feels good, roll your shoulders slowly. Now think of a place that has made you feel peaceful. Picture one small detail from that place. When you are ready, play, sing, or hum part of a favorite song. Let the music keep you company. You have given yourself a kind moment today.",
      help: "There is no perfect way to do today's moment. Breathe normally if slow breaths feel uncomfortable, and stay still if you prefer. For the memory, simply choose any place that felt safe or pleasant. Your song can be played, sung, hummed, or quietly remembered."
    },
    2: {
      title: "Find a Gentle Rhythm",
      prompt: "Notice your own pace today, loosen your hands, and remember a familiar daily rhythm.",
      steps: [
        "Settle into a comfortable position.",
        "Take two unhurried breaths.",
        "Open and close your hands slowly three times.",
        "Tap a gentle beat with one hand, or simply listen for a rhythm around you.",
        "Remember a morning routine you once enjoyed.",
        "Choose a favorite song with a steady beat and enjoy a short part of it."
      ],
      voiceScript: "Welcome back. Settle into a comfortable position and let your hands rest. Take an unhurried breath in, and let it go. Take one more easy breath. Slowly open your hands, then let them close softly. Do that two more times if it feels comfortable. Now tap a gentle beat with one hand, or simply notice a rhythm around you. Think of a morning routine you once enjoyed. Maybe there was a familiar sound, smell, or person nearby. Hold one detail in your mind. Choose a favorite song with a steady beat. Listen, sing, or tap along for a little while. Your own pace is enough today.",
      help: "Make every movement small and comfortable. If hand movement is not right for you, listen for a clock, footsteps, or your own breathing instead. Any familiar morning memory is enough—even a cup, a window, or a favorite chair."
    },
    3: {
      title: "A Kind Memory",
      prompt: "Make room for one good memory, with a gentle stretch and music that brings warmth.",
      steps: [
        "Sit or stand in a steady, comfortable way.",
        "Breathe in gently and breathe out slowly two times.",
        "Reach your hands forward a little, then bring them back to rest.",
        "Think of someone who once made you smile.",
        "Remember one kind or funny thing about that person.",
        "Enjoy a song that reminds you of good company."
      ],
      voiceScript: "Welcome. Give yourself a moment to get comfortable. Breathe in gently, and breathe out slowly. Once more, take an easy breath and let it go. If it feels good, reach your hands forward just a little, then bring them back to rest. You may also stay still. Think of someone who once made you smile. Remember one kind or funny thing about that person. Let the memory be simple. You do not need to tell the whole story. Now choose a song that reminds you of good company. Listen, sing, or hum along. A warm memory can be a companion for this moment.",
      help: "You may skip the stretch and rest your hands instead. The person you remember can be a relative, friend, neighbor, teacher, or anyone who brought a smile. If no memory comes today, enjoy the music and let that be enough."
    },
    4: {
      title: "Notice Something Good",
      prompt: "Pause for a small comfort, gently wake up the body, and recall a simple pleasure.",
      steps: [
        "Look around and notice one color or object you like.",
        "Take three comfortable breaths at your natural pace.",
        "Lift one heel, set it down, then try the other side while seated. Skip this if needed.",
        "Think of a meal, garden, view, or small pleasure you have enjoyed.",
        "Name one detail that made it special.",
        "Spend a moment with a song that lifts your spirits."
      ],
      voiceScript: "Welcome to today's moment. Look around and notice one color or object you like. Let your eyes rest there. Take a comfortable breath, and then another, at your own natural pace. Take one more if you wish. While seated, you may lift one heel and set it down, then try the other side. Keep still if that feels better. Think of a simple pleasure you have enjoyed: a meal, a garden, a view, or something else. Notice one detail that made it special. Now spend a little time with a song that lifts your spirits. Listen in the way that feels right. Small good things are worth noticing.",
      help: "Today's good thing can be very small: warm light, a comfortable sweater, a familiar cup, or a pleasant sound. Keep both feet still if heel lifts are uncomfortable. You can choose any song that feels friendly or hopeful."
    },
    5: {
      title: "Remember Connection",
      prompt: "Breathe, soften your shoulders, and remember a moment when you felt welcomed.",
      steps: [
        "Settle comfortably and let your shoulders soften.",
        "Take two gentle breaths without forcing them.",
        "Turn your palms upward, then let your hands rest again.",
        "Remember a gathering, visit, or conversation you enjoyed.",
        "Picture one sound or face from that moment.",
        "Enjoy a favorite song you might share with someone else."
      ],
      voiceScript: "Welcome. Let yourself settle and allow your shoulders to soften. Take a gentle breath without forcing it. Let it go, and take one more easy breath. If it feels comfortable, turn your palms upward for a moment, then let your hands rest again. Remember a gathering, visit, or conversation you enjoyed. Picture one sound, one face, or one small part of that moment. There is no need to search for every detail. Now choose a favorite song you might share with someone else. Listen, sing, or hum. Connection can live in a memory, a voice, and a song.",
      help: "A connection can be a short chat with a neighbor, time with family, a community gathering, or a friendly hello. If a memory feels difficult, let it pass and return to your breathing or music. Resting quietly also counts."
    },
    6: {
      title: "A Moment of Thanks",
      prompt: "Take an easy pause and appreciate one person, place, or everyday comfort.",
      steps: [
        "Find a comfortable position and rest your hands.",
        "Take three easy breaths.",
        "Gently look left, return to center, then look right. Keep your head still if preferred.",
        "Think of one person, place, or everyday comfort you appreciate.",
        "Quietly say, “I am glad for this.”",
        "Choose a song that feels comforting and enjoy it for a moment."
      ],
      voiceScript: "Welcome. Find a comfortable position and let your hands rest. Take an easy breath in and let it out. Take another gentle breath. And one more, if you would like. You may slowly look to the left, return to center, then look to the right. Keep your head still if that is better for you. Think of one person, place, or everyday comfort you appreciate. Quietly say, I am glad for this. Nothing grand is needed. Now choose a song that feels comforting. Let it play, or hold it in your memory. This small moment of thanks belongs to you.",
      help: "Appreciation does not have to feel big. It might be for a person, a pet, a sunny window, a warm drink, or simply getting through the day. Keep your head still if turning is uncomfortable, and move only your eyes if you wish."
    },
    7: {
      title: "Celebrate Your Week",
      prompt: "Look back with kindness, enjoy a comfortable stretch, and end the week with a beloved song.",
      steps: [
        "Settle in and notice that you made time for yourself this week.",
        "Take three calm, comfortable breaths.",
        "Stretch your fingers wide, then relax them. Skip this if needed.",
        "Remember one Companion Moment from this week that felt good.",
        "Give yourself credit for showing up in your own way.",
        "Choose a beloved song and enjoy it as your week-ending celebration."
      ],
      voiceScript: "Welcome to the seventh Companion Moment. Settle in and notice that you made time for yourself this week. Take a calm, comfortable breath and let it go. Take another easy breath. And one more at your own pace. If it feels good, stretch your fingers wide, then let them relax. Think back over the week. Remember one moment, one memory, or one song that felt good. Give yourself credit for showing up in your own way. Now choose a beloved song. Listen, sing, hum, or tap along. Let this be your celebration. You completed a full week of kind moments for yourself.",
      help: "There is nothing to score and nothing you had to do perfectly. Choose any part of the week you liked, even if it was only one breath or one song. If you missed something, you still belong in this celebration."
    }
  }
};
