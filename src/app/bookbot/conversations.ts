/* ══════════════════════════════════════════════════════════════
   Real-world conversation data for BookBot demo.
   Based on patterns from 2,432 real production conversations.
   Each conversation: 20+ turns, emotional arc, real capabilities.
   ══════════════════════════════════════════════════════════════ */

export type Line = {
  role: 'ai' | 'caller' | 'system' | 'tool';
  text: string;
};

export type Conversation = {
  title: string;
  biz: string;
  caller: string;
  scenario: string;
  lines: Line[];
};

export const conversations: Conversation[] = [
  /* ── 1. Frustrated returning customer, urgent pipe burst ── */
  {
    title: 'Emergency Pipe Burst',
    biz: 'Wilson Plumbing',
    caller: '(702) 555-0147',
    scenario: 'Frustrated repeat customer with an urgent leak',
    lines: [
      { role: 'ai', text: 'Thank you for calling Wilson Plumbing, this is BookBot. How can I help you today?' },
      { role: 'caller', text: 'Yeah hi, I have water pouring out from under my kitchen sink. It\'s everywhere. I need someone out here now.' },
      { role: 'ai', text: 'I\'m sorry to hear that. I understand this is urgent — let me help you right away. Can I get your name?' },
      { role: 'caller', text: 'It\'s Maria Gonzalez. I\'ve used you guys before, back in November I think.' },
      { role: 'tool', text: '🔍 Looking up Maria Gonzalez...' },
      { role: 'ai', text: 'I found you, Maria. I see we were out on November 14th for a garbage disposal replacement at 2847 Desert Rose Drive. Is that still your address?' },
      { role: 'caller', text: 'Yes that\'s me. Look, the water is still running, I turned off the valve under the sink but it\'s not stopping completely.' },
      { role: 'ai', text: 'Okay Maria, here\'s what I\'d suggest — there should be a main water shutoff valve, usually near your water heater or where the main line enters your house. Can you get to that?' },
      { role: 'caller', text: 'I... I don\'t know where that is. My husband usually handles this stuff and he\'s at work.' },
      { role: 'ai', text: 'No worries. It\'s usually in the garage or near the front of the house, a round valve or a lever. But let\'s get you scheduled first — I\'m flagging this as an emergency visit.' },
      { role: 'tool', text: '📅 Checking emergency availability...' },
      { role: 'ai', text: 'I have Mike available in about 45 minutes. He can be there by 2:15. Does that work?' },
      { role: 'caller', text: '45 minutes?! The water is everywhere! Don\'t you have anyone closer?' },
      { role: 'ai', text: 'I completely understand your frustration, Maria. Mike is actually the closest technician to your area right now. He\'s finishing up a job in Henderson. Let me see if anyone else is available...' },
      { role: 'tool', text: '📅 Checking all technician locations...' },
      { role: 'ai', text: 'Mike is still the fastest option at 45 minutes. I\'m going to book him now and send him your way. In the meantime, if you can find that main shutoff, that will stop the water completely.' },
      { role: 'caller', text: 'Okay fine. 45 minutes. Can you tell him to call me when he\'s on his way?' },
      { role: 'ai', text: 'Absolutely. I\'ve added a note for Mike to call you when he\'s en route. I also have your number as (702) 555-0147 — is that the best number?' },
      { role: 'caller', text: 'Yes that\'s my cell.' },
      { role: 'tool', text: '✅ Booking emergency visit...' },
      { role: 'ai', text: 'All set, Maria. Mike will be at 2847 Desert Rose Drive by 2:15 PM today. Emergency pipe repair. He\'ll call you when he leaves his current job.' },
      { role: 'caller', text: 'Okay. Thank you. I\'m sorry I was short with you, I\'m just stressed.' },
      { role: 'ai', text: 'No need to apologize at all — a burst pipe is stressful. You\'re handling it great. You\'ll get a text confirmation in just a moment. Is there anything else I can help with?' },
      { role: 'caller', text: 'No, that\'s it. Thank you.' },
      { role: 'system', text: '✓ Emergency visit booked — Today 2:15 PM\nTech: Mike | 2847 Desert Rose Dr\nSMS confirmation sent to (702) 555-0147' },
    ],
  },

  /* ── 2. New customer, price-sensitive, HVAC maintenance ── */
  {
    title: 'HVAC Maintenance Inquiry',
    biz: 'Peak HVAC Services',
    caller: '(480) 555-0283',
    scenario: 'New customer comparing prices, needs convincing',
    lines: [
      { role: 'ai', text: 'Peak HVAC Services, this is BookBot. How can I help you today?' },
      { role: 'caller', text: 'Hi, yeah, I\'m looking to get my AC tuned up before summer. How much does that cost?' },
      { role: 'ai', text: 'Great timing — we actually have a spring special right now. AC tune-ups are $79, normally $129. That includes a full system inspection, filter check, and refrigerant level test.' },
      { role: 'caller', text: '$79? The company I called before said $59. Why are you more expensive?' },
      { role: 'ai', text: 'That\'s a fair question. Our tune-up includes a 21-point inspection, which is more thorough than most. We also check your ductwork for leaks and test your thermostat calibration. Some companies charge extra for those. Can I ask — is this for a home or a business?' },
      { role: 'caller', text: 'It\'s for my house. I\'ve got a 3-ton unit, about 8 years old I think.' },
      { role: 'ai', text: 'An 8-year-old system is right at the age where regular maintenance really pays off. At that age, small issues caught early can save thousands in repairs down the road. Would you like to schedule the tune-up?' },
      { role: 'caller', text: 'Maybe. What if you find something wrong? Do you try to upsell me on a bunch of stuff?' },
      { role: 'ai', text: 'I appreciate you asking that directly. Our technicians document everything with photos and only recommend repairs you actually need. There\'s never any pressure — you get a written quote and you decide. No surprises.' },
      { role: 'caller', text: 'Alright, that sounds fair. What do you have available? I need a morning appointment, I work afternoons.' },
      { role: 'tool', text: '📅 Checking morning availability...' },
      { role: 'ai', text: 'I have next Tuesday at 8:00 AM or Wednesday at 9:30 AM. Both are morning slots. Which works better for you?' },
      { role: 'caller', text: 'Tuesday at 8 is good. Early is better.' },
      { role: 'ai', text: 'Perfect. And can I get your name and address?' },
      { role: 'caller', text: 'James Whitfield. 1592 East Thunderbird Road, Phoenix.' },
      { role: 'ai', text: 'Got it, James. And is (480) 555-0283 the best number to reach you?' },
      { role: 'caller', text: 'Yeah, that\'s my cell. Oh wait — do your guys wear shoe covers? Last company tracked dirt through my whole house.' },
      { role: 'ai', text: 'Yes, all our technicians wear shoe covers and lay down drop cloths. We also clean up before we leave. That\'s standard on every visit.' },
      { role: 'caller', text: 'Good. Alright, let\'s do it.' },
      { role: 'tool', text: '✅ Booking appointment...' },
      { role: 'ai', text: 'You\'re all set, James. Tuesday at 8:00 AM, AC tune-up at 1592 East Thunderbird Road. The $79 spring rate. You\'ll get a text confirmation right now and a reminder the day before.' },
      { role: 'caller', text: 'Sounds good. Thanks for being upfront about the pricing.' },
      { role: 'ai', text: 'Of course. We want you comfortable before we even show up. See you Tuesday, James.' },
      { role: 'system', text: '✓ Booked — Tue 8:00 AM\nAC Tune-Up ($79 spring special)\n1592 E Thunderbird Rd, Phoenix\nSMS confirmation sent' },
    ],
  },

  /* ── 3. After-hours, frantic, water heater emergency ── */
  {
    title: 'After-Hours Water Heater',
    biz: 'Wilson Plumbing',
    caller: '(702) 555-0923',
    scenario: 'Late night emergency, caller is panicking',
    lines: [
      { role: 'ai', text: 'Wilson Plumbing after-hours line, this is BookBot. What\'s going on?' },
      { role: 'caller', text: 'Oh thank god someone answered! My water heater is leaking everywhere — there\'s water all over my garage floor. It\'s 10 PM and I don\'t know what to do!' },
      { role: 'ai', text: 'I\'m here to help. First things first — is the water hot or is it safe to walk near the heater?' },
      { role: 'caller', text: 'It\'s warm but not scalding. There\'s like a puddle spreading across the garage. I have stuff stored in there — boxes and everything.' },
      { role: 'ai', text: 'Okay. There should be a valve at the top of the water heater — a round handle, usually red or silver. Can you turn that clockwise to shut off the water supply to the heater?' },
      { role: 'caller', text: 'Hold on... okay I see it. It\'s really stiff.' },
      { role: 'ai', text: 'Try using a towel for grip. Turn it clockwise — righty tighty.' },
      { role: 'caller', text: 'Okay... okay I got it. I think the water is slowing down. Yes, it\'s stopping.' },
      { role: 'ai', text: 'Great job. That\'s the hardest part done. The leak should stop completely in a minute. Now — are you an existing customer with us?' },
      { role: 'caller', text: 'No, I just googled plumber near me. I\'ve never used you before.' },
      { role: 'ai', text: 'No problem at all. I\'m glad you called. Since the water is stopped, this isn\'t a middle-of-the-night emergency anymore. I can get someone out first thing tomorrow morning. Our emergency rate for tonight would be $250 just for the service call, or $89 for a regular morning visit.' },
      { role: 'caller', text: 'Will the water stay off until morning? Like, is it safe to go to sleep?' },
      { role: 'ai', text: 'Yes, with that valve closed, no more water will flow to the heater. You\'ll still have cold water at your faucets. You just won\'t have hot water until we fix or replace the unit tomorrow.' },
      { role: 'caller', text: 'Okay. Then yeah, morning is fine. I don\'t need to pay $250. How early can someone come?' },
      { role: 'tool', text: '📅 Checking earliest morning availability...' },
      { role: 'ai', text: 'I can get Jason out to you at 7:30 AM — he\'s our first appointment. He\'ll assess whether it needs repair or replacement and give you options with pricing before any work starts.' },
      { role: 'caller', text: 'God, 7:30 is perfect. I have kids who need showers before school.' },
      { role: 'ai', text: 'Understood — Jason knows water heaters inside and out. Can I get your name and address?' },
      { role: 'caller', text: 'Sarah Chen. 4201 West Flamingo Road.' },
      { role: 'tool', text: '✅ Booking first-available morning visit...' },
      { role: 'ai', text: 'All set, Sarah. Jason will be at 4201 West Flamingo at 7:30 AM tomorrow. Water heater assessment, $89 service call. He\'ll call 15 minutes before arrival.' },
      { role: 'caller', text: 'Thank you so much. I was literally about to have a panic attack. I didn\'t think anyone would answer at 10 PM.' },
      { role: 'ai', text: 'That\'s exactly why we\'re here 24/7. You did the right thing shutting off that valve — you handled it perfectly. Get some rest, and Jason will take care of the rest in the morning.' },
      { role: 'system', text: '✓ Booked — Tomorrow 7:30 AM\nTech: Jason | Water heater assessment ($89)\n4201 W Flamingo Rd\nSMS confirmation sent to (702) 555-0923' },
    ],
  },

  /* ── 4. Existing customer, schedule confusion, multiple family members ── */
  {
    title: 'Schedule Mix-Up',
    biz: 'Bright Smile Dental',
    caller: '(702) 555-1156',
    scenario: 'Confused about appointment times, managing family schedules',
    lines: [
      { role: 'ai', text: 'Bright Smile Dental, this is BookBot. How can I help you today?' },
      { role: 'caller', text: 'Hi, I called earlier about my son\'s appointment. Jacob Torres. I think it was supposed to be at 3:00 but I\'m not sure anymore.' },
      { role: 'tool', text: '🔍 Looking up Jacob Torres...' },
      { role: 'ai', text: 'I found Jacob. It looks like he has a cleaning scheduled for this Thursday at 3:30 PM with Dr. Kim. Is that what you\'re thinking of?' },
      { role: 'caller', text: '3:30? I thought it was 3:00. Are you sure?' },
      { role: 'ai', text: 'Let me double-check... Yes, it\'s showing 3:30 PM on Thursday the 24th. It was booked last Tuesday.' },
      { role: 'caller', text: 'Okay... well, here\'s the thing. My daughter Emma also needs to come in. She\'s been complaining about a tooth. Can I get her in the same day?' },
      { role: 'ai', text: 'Let me look at the schedule for Thursday afternoon.' },
      { role: 'tool', text: '📅 Checking Thursday availability...' },
      { role: 'ai', text: 'Dr. Kim has a 4:00 PM slot right after Jacob. That way you only make one trip. Would that work for Emma?' },
      { role: 'caller', text: 'That\'s perfect! Is she a patient already? She might be under my name — Patricia Torres.' },
      { role: 'tool', text: '🔍 Looking up Emma Torres / Patricia Torres...' },
      { role: 'ai', text: 'I see Patricia Torres in the system but I don\'t have an Emma listed. Is this her first visit with us?' },
      { role: 'caller', text: 'Yeah, she usually goes to a different dentist but that office closed. She\'s 14.' },
      { role: 'ai', text: 'Got it. I\'ll set her up as a new patient under your account. For a first visit with a toothache complaint, Dr. Kim will do an exam and X-rays. Is Emma on your dental insurance?' },
      { role: 'caller', text: 'Yes, same insurance as Jacob. Delta Dental.' },
      { role: 'ai', text: 'Perfect, I\'ll note Delta Dental for Emma. You\'ll get new patient forms via text — if you can fill them out before Thursday, it\'ll save time at the office.' },
      { role: 'caller', text: 'Okay. So Jacob at 3:30, Emma at 4:00, both Thursday?' },
      { role: 'ai', text: 'Exactly right. Both with Dr. Kim. Jacob is a cleaning, Emma is a new patient exam for the toothache.' },
      { role: 'caller', text: 'Great. And I won\'t get charged for Emma\'s X-rays separately, right? That\'s covered under the exam?' },
      { role: 'ai', text: 'Standard diagnostic X-rays are included in the new patient exam. If Dr. Kim recommends anything additional, they\'ll discuss it with you first. No surprises.' },
      { role: 'caller', text: 'You\'re way easier to deal with than the last office. Thank you.' },
      { role: 'ai', text: 'Happy to help, Patricia. You\'ll get a text confirmation for both appointments and a reminder Wednesday evening. Anything else?' },
      { role: 'system', text: '✓ Thu 3:30 PM — Jacob Torres (cleaning)\n✓ Thu 4:00 PM — Emma Torres (new patient exam)\nBoth with Dr. Kim | Delta Dental\nForms sent to Patricia Torres' },
    ],
  },

  /* ── 5. Electrician, caller scared about safety ── */
  {
    title: 'Sparking Outlet',
    biz: 'Bright Spark Electric',
    caller: '(503) 555-0391',
    scenario: 'Caller scared about electrical safety, needs reassurance',
    lines: [
      { role: 'ai', text: 'Bright Spark Electric, this is BookBot. How can I help you?' },
      { role: 'caller', text: 'Hi, um, this might sound dumb but one of my outlets sparked when I plugged in my phone charger. Like, an actual spark. Should I be worried?' },
      { role: 'ai', text: 'That doesn\'t sound dumb at all — you\'re right to call. A spark from an outlet can mean a loose connection, which is a potential fire hazard. Don\'t plug anything else into that outlet for now.' },
      { role: 'caller', text: 'Oh god. Fire hazard? I have kids in the house.' },
      { role: 'ai', text: 'I don\'t want to scare you — not every spark means danger. But it does mean something should be inspected. How old is your house, if you know?' },
      { role: 'caller', text: 'It was built in like 1987 I think. We bought it three years ago.' },
      { role: 'ai', text: 'Okay, that age of wiring is worth keeping an eye on. I\'d recommend getting the outlet inspected. If it\'s a loose wire, it\'s a quick fix. If the wiring is degraded, better to catch it early.' },
      { role: 'caller', text: 'How much does an inspection cost?' },
      { role: 'ai', text: 'A standard outlet inspection is $89, which covers the diagnostic. If it\'s a simple loose connection, most electricians can fix it on the spot for no additional charge. If it needs more work, you\'ll get a quote before anything is done.' },
      { role: 'caller', text: 'That\'s reasonable. When can someone come?' },
      { role: 'tool', text: '📅 Checking availability...' },
      { role: 'ai', text: 'I have tomorrow morning at 9:00 AM or Thursday afternoon at 2:00 PM. Given the spark, I\'d recommend the earlier slot.' },
      { role: 'caller', text: 'Tomorrow at 9 works. Should I turn off the breaker for that outlet tonight?' },
      { role: 'ai', text: 'That\'s actually a great idea. If you know which breaker controls that outlet, flipping it off is the safest move until our electrician takes a look. If you\'re not sure which breaker, just don\'t use that outlet.' },
      { role: 'caller', text: 'I\'ll figure out the breaker. Can I get your electrician\'s name? I want to know who\'s coming to my house.' },
      { role: 'ai', text: 'Completely understand. Your technician will be Dave Martinez. He\'s been with Bright Spark for 12 years, fully licensed. He\'ll call 15 minutes before arrival.' },
      { role: 'caller', text: 'And he\'ll have ID or something?' },
      { role: 'ai', text: 'Yes, all our technicians wear company uniforms and carry photo ID. Dave will also arrive in a marked Bright Spark van.' },
      { role: 'caller', text: 'Okay good. My name is Jennifer Park, address is 8847 Northwest Everett Street.' },
      { role: 'tool', text: '✅ Booking appointment...' },
      { role: 'ai', text: 'All set, Jennifer. Dave Martinez, tomorrow at 9:00 AM, 8847 NW Everett Street. Outlet inspection, $89. He\'ll call before he arrives.' },
      { role: 'caller', text: 'Thank you. I feel a lot better now. I was worried I was overreacting.' },
      { role: 'ai', text: 'You\'re not overreacting at all. When it comes to electrical, it\'s always better to check. You\'re doing the right thing for your family. See you tomorrow.' },
      { role: 'system', text: '✓ Booked — Tomorrow 9:00 AM\nTech: Dave Martinez | Outlet inspection ($89)\n8847 NW Everett St\nSMS confirmation sent' },
    ],
  },
];
