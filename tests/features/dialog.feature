Feature: Dialog
  Defining accessible Dialog box behaviors.

  Background:
    Given a page with some dialog boxes


  Rule: Opening & Closing
    The following scenarios describe the opening and closing behavior of accessible dialog boxes.

    Scenario: Open a Dialog box
      Given a button that open a Dialog box
       When I activate the button
       Then a Dialog box is opened
        And the Dialog box has the focus
        And the Dialog box is readable by screen readers

    Scenario: Close an opened Dialog box with the keyboard
      Given an open Dialog box
       When I hit the "Escape" key
       Then the Dialog box is closed

    Scenario: Close an open Dialog box with a dedicated button
      Note that it is best practice (if not mandatory) for dialog boxes to contain a closing button.

      Given an open Dialog box
       When I activate its closing button
       Then the Dialog box is closed

    Scenario: Open a Dialog box while another is open
      Given an open Dialog box
        And a button that open another Dialog box
       When I activate the button
       Then the open Dialog box is closed
        And a different Dialog box is opened


  Rule: Focus management
    Dialog boxes are well known focus trap. The following scenario describe the expected accessible behaviors around focus management.

    Scenario: Restore the focus when a Dialog box is closed
      Given an element that had the focus
        And an open Dialog box, which now has the focus
       When I close the Dialog box
       Then the element regain the focus

    Scenario: The focus is trapped inside the Dialog box
      Given an open Dialog box
        And the Dialog box has the focus
       When I circle through the focusable elements with the "Tab" key
       Then the focus is always inside the Dialog box

    Scenario: The focus can't be set outside the Dialog box
      Given an open Dialog box
        And the Dialog box has the focus
       When I try to give the focus to an element outside the Dialog box
       Then the focus remain unchanged
