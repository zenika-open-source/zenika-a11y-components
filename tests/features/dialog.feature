Feature: Dialog
  Defining accessible Dialog box behaviors.

  Background:
    Given a page with some dialog boxes

  Scenario: Open a Dialog box
    Given a button that open a Dialog box
     When I activate the button
     Then a Dialog box is open
      And the Dialog box has the focus
      And the Dialog box is readable by screen readers

  Scenario: Close an open Dialog box with the keyboard
    Given an open Dialog box
     When I hit the "Escape" key
     Then the Dialog box is closed

  Scenario: Close an open Dialog box with a dedicated button
    Given an open Dialog box
     When I activate its close button
     Then the Dialog box is closed

  Scenario: Open a Dialog box while another is open
    Given an open Dialog box
      And a button that open another Dialog box
     When I activate the button
     Then the open Dialog box is closed
      And a different Dialog box is open

  Scenario: Restore the focus when a Dialog box is closed
    Given an element that had the focus
      And an open Dialog box, which now has the focus
     When I close the Dialog box
     Then the element regain the focus
