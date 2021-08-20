Feature: Dry run test
  This is a simple dry run to check if the whole stack is working properly

  Scenario Outline: I can load a local test page in a browser
    Given I access the "<folder>" homepage
    Then I see the homepage

  Examples:
    | folder |
    | html   |
