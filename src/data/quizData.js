const quizData = {
  sections: [
    {
      id: 'attachment',
      title: 'Attachment Style',
      emoji: '💗',
      questions: [
        {
          id: 1,
          text: 'When your partner is away for a few days, how do you typically feel?',
          options: [
            { text: 'I miss them but feel confident we\'re fine', value: 'secure' },
            { text: 'I worry a lot and need frequent reassurance', value: 'anxious' },
            { text: 'I enjoy the independence and personal space', value: 'avoidant' },
            { text: 'I feel conflicted — I want them close but also push away', value: 'fearful' },
          ],
        },
        {
          id: 2,
          text: 'How do you handle conflict in your relationship?',
          options: [
            { text: 'I calmly discuss issues and seek compromise', value: 'secure' },
            { text: 'I become anxious and need to resolve things immediately', value: 'anxious' },
            { text: 'I tend to withdraw and need space before talking', value: 'avoidant' },
            { text: 'I swing between wanting to talk and wanting to run', value: 'fearful' },
          ],
        },
        {
          id: 3,
          text: 'How do you feel about emotional vulnerability?',
          options: [
            { text: 'I\'m comfortable sharing my feelings openly', value: 'secure' },
            { text: 'I share a lot, sometimes too much, seeking validation', value: 'anxious' },
            { text: 'I find it difficult and prefer to keep things private', value: 'avoidant' },
            { text: 'I want to open up but fear being hurt', value: 'fearful' },
          ],
        },
        {
          id: 4,
          text: 'What best describes your need for closeness?',
          options: [
            { text: 'I enjoy closeness while maintaining healthy boundaries', value: 'secure' },
            { text: 'I crave constant closeness and can feel clingy', value: 'anxious' },
            { text: 'I prefer independence and can feel suffocated easily', value: 'avoidant' },
            { text: 'I desire closeness but sabotage it when it gets real', value: 'fearful' },
          ],
        },
        {
          id: 5,
          text: 'When you feel insecure in the relationship, you...',
          options: [
            { text: 'Talk to my partner about what I need', value: 'secure' },
            { text: 'Seek constant reassurance and check in frequently', value: 'anxious' },
            { text: 'Shut down and create emotional distance', value: 'avoidant' },
            { text: 'Test my partner to see if they really care', value: 'fearful' },
          ],
        },
      ],
    },
    {
      id: 'loveLanguage',
      title: 'Love Language',
      emoji: '💝',
      questions: [
        {
          id: 6,
          text: 'What makes you feel most loved?',
          options: [
            { text: 'Hearing "I love you" and genuine compliments', value: 'words' },
            { text: 'When my partner helps with tasks or does favors', value: 'acts' },
            { text: 'Receiving a thoughtful, meaningful gift', value: 'gifts' },
            { text: 'Spending undivided quality time together', value: 'time' },
          ],
        },
        {
          id: 7,
          text: 'What hurts you the most in a relationship?',
          options: [
            { text: 'Harsh criticism or lack of verbal appreciation', value: 'words' },
            { text: 'When my partner is lazy or doesn\'t help out', value: 'acts' },
            { text: 'Forgotten birthdays or thoughtless gifts', value: 'gifts' },
            { text: 'When my partner is always distracted or busy', value: 'time' },
          ],
        },
        {
          id: 8,
          text: 'How do you prefer to show love?',
          options: [
            { text: 'Writing love notes or expressing feelings verbally', value: 'words' },
            { text: 'Doing helpful things and anticipating their needs', value: 'acts' },
            { text: 'Finding the perfect meaningful present', value: 'gifts' },
            { text: 'Planning special activities to do together', value: 'time' },
          ],
        },
        {
          id: 9,
          text: 'On a perfect anniversary, what matters most?',
          options: [
            { text: 'A heartfelt letter or speech about our journey', value: 'words' },
            { text: 'My partner handling all the planning and details', value: 'acts' },
            { text: 'A carefully chosen, meaningful gift', value: 'gifts' },
            { text: 'A full day of undivided attention together', value: 'time' },
          ],
        },
        {
          id: 10,
          text: 'After a tough day, what do you need most from your partner?',
          options: [
            { text: 'Words of encouragement and emotional support', value: 'words' },
            { text: 'Help with chores so I can relax', value: 'acts' },
            { text: 'A small surprise to cheer me up', value: 'gifts' },
            { text: 'Just sit with me and be present', value: 'time' },
          ],
        },
      ],
    },
    {
      id: 'communication',
      title: 'Communication Style',
      emoji: '🗣️',
      questions: [
        {
          id: 11,
          text: 'How do you typically express disagreement?',
          options: [
            { text: 'I clearly state my perspective while respecting theirs', value: 'assertive' },
            { text: 'I tend to agree even when I disagree to avoid conflict', value: 'passive' },
            { text: 'I can get heated and say things I don\'t mean', value: 'aggressive' },
            { text: 'I take time to think before sharing my thoughts', value: 'reflective' },
          ],
        },
        {
          id: 12,
          text: 'When your partner does something that bothers you...',
          options: [
            { text: 'I bring it up directly but kindly', value: 'assertive' },
            { text: 'I drop hints and hope they figure it out', value: 'passive' },
            { text: 'I let it build up until I explode', value: 'aggressive' },
            { text: 'I journal or process it internally first', value: 'reflective' },
          ],
        },
        {
          id: 13,
          text: 'In group settings with friends, you tend to...',
          options: [
            { text: 'Share opinions openly and engage in debates', value: 'assertive' },
            { text: 'Go with the flow and support others\' ideas', value: 'passive' },
            { text: 'Dominate conversations and push my viewpoint', value: 'aggressive' },
            { text: 'Listen carefully and contribute thoughtfully', value: 'reflective' },
          ],
        },
        {
          id: 14,
          text: 'When making important decisions together...',
          options: [
            { text: 'I advocate for my needs while considering theirs', value: 'assertive' },
            { text: 'I usually defer to my partner\'s preference', value: 'passive' },
            { text: 'I feel strongly and push for my choice', value: 'aggressive' },
            { text: 'I research thoroughly before sharing my input', value: 'reflective' },
          ],
        },
        {
          id: 15,
          text: 'How do you prefer to apologize?',
          options: [
            { text: 'I take responsibility and discuss how to fix it', value: 'assertive' },
            { text: 'I over-apologize even when it\'s not my fault', value: 'passive' },
            { text: 'I struggle to admit fault but eventually come around', value: 'aggressive' },
            { text: 'I write my thoughts down and share a considered apology', value: 'reflective' },
          ],
        },
      ],
    },
    {
      id: 'values',
      title: 'Life Values',
      emoji: '🌟',
      questions: [
        {
          id: 16,
          text: 'What matters most to you in life?',
          options: [
            { text: 'Building a loving family and home', value: 'family' },
            { text: 'Achieving professional success and impact', value: 'career' },
            { text: 'Exploring the world and seeking new experiences', value: 'adventure' },
            { text: 'Creating a secure, comfortable, peaceful life', value: 'stability' },
          ],
        },
        {
          id: 17,
          text: 'Your ideal use of a financial windfall would be...',
          options: [
            { text: 'Creating a beautiful home for our family', value: 'family' },
            { text: 'Investing in education or starting a business', value: 'career' },
            { text: 'Booking an amazing round-the-world trip', value: 'adventure' },
            { text: 'Saving it for financial security and peace of mind', value: 'stability' },
          ],
        },
        {
          id: 18,
          text: 'When imagining your life in 10 years, you see...',
          options: [
            { text: 'A bustling home full of family gatherings', value: 'family' },
            { text: 'Leading a team or running a successful venture', value: 'career' },
            { text: 'Having lived in multiple countries with amazing stories', value: 'adventure' },
            { text: 'A well-established routine in a place you love', value: 'stability' },
          ],
        },
        {
          id: 19,
          text: 'What would you sacrifice for a major opportunity?',
          options: [
            { text: 'Very little — family time is non-negotiable', value: 'family' },
            { text: 'Comfort and free time for career growth', value: 'career' },
            { text: 'Stability — I\'d move anywhere for the right experience', value: 'adventure' },
            { text: 'I wouldn\'t — I value consistency above most things', value: 'stability' },
          ],
        },
        {
          id: 20,
          text: 'What role should a relationship play in your life?',
          options: [
            { text: 'It\'s the foundation — everything is built around it', value: 'family' },
            { text: 'A supportive partnership that fuels individual growth', value: 'career' },
            { text: 'A shared adventure with an amazing co-pilot', value: 'adventure' },
            { text: 'A safe harbor that provides peace and grounding', value: 'stability' },
          ],
        },
      ],
    },
  ],
};

export default quizData;
