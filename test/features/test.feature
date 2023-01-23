Feature: Get Ids from Collection


    Scenario: Correct collection Id
        Given i have my collection id
        When I give a valid collection Id
        Then the function returns a Json response with an error code of 200