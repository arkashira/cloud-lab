package main

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sts"
	"github.com/spf13/cobra"
)

func main() {
	cmd := &cobra.Command{
		Use:   "wizard",
		Short: "A guided CLI wizard for provisioning a sandbox with minimal configuration",
		Run: func(cmd *cobra.Command, args []string) {
			awsAccessKeyID, _ := cmd.Flags().GetString("aws-access-key-id")
			awsSecretAccessKey, _ := cmd.Flags().GetString("aws-secret-access-key")

			sess, err := session.NewSession(&aws.Config{
				Credentials: credentials.NewStaticCredentials(awsAccessKeyID, awsSecretAccessKey, ""),
			})
			if err != nil {
				fmt.Println("Error creating session:", err)
				os.Exit(1)
			}

			stsSvc := sts.New(sess)
			input := &sts.GetCallerIdentityInput{}
			result, err := stsSvc.GetCallerIdentity(input)
			if err != nil {
				fmt.Println("Error validating credentials:", err)
				os.Exit(1)
			}

			fmt.Printf("Validated credentials for ARN: %s\n", *result.Arn)

			// Placeholder for provisioning logic
			fmt.Println("Provisioning sandbox...")

			// Placeholder for progress display and cost estimation
			fmt.Println("Progress: 100%, Estimated Cost: $0.00")
		},
	}

	flags := cmd.Flags()
	flags.StringP("aws-access-key-id", "i", "", "AWS Access Key ID")
	flags.StringP("aws-secret-access-key", "s", "", "AWS Secret Access Key")

	if err := cmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}