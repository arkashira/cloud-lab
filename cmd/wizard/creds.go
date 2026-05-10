package wizard

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sts"
	"github.com/manifoldco/promptui"
)

type Credentials struct {
	AccessKeyID     string
	SecretAccessKey string
	Region          string
}

func GetCredentials() (Credentials, error) {
	var creds Credentials

	prompt := promptui.Prompt{
		Label: "AWS Access Key ID",
		Validate: func(input string) error {
			if input == "" {
				return fmt.Errorf("access key ID cannot be empty")
			}
			return nil
		},
	}

	creds.AccessKeyID, _ = prompt.Run()

	prompt = promptui.Prompt{
		Label: "AWS Secret Access Key",
		Validate: func(input string) error {
			if input == "" {
				return fmt.Errorf("secret access key cannot be empty")
			}
			return nil
		},
	}

	creds.SecretAccessKey, _ = prompt.Run()

	prompt = promptui.Prompt{
		Label: "AWS Region",
		Validate: func(input string) error {
			if input == "" {
				return fmt.Errorf("region cannot be empty")
			}
			return nil
		},
	}

	creds.Region, _ = prompt.Run()

	return creds, nil
}

func ValidateCredentials(creds Credentials) error {
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String(creds.Region),
		Credentials: credentials.NewStaticCredentials(creds.AccessKeyID, creds.SecretAccessKey, ""),
	})

	if err != nil {
		return err
	}

	svc := sts.New(sess)
	_, err = svc.GetCallerIdentity(nil)

	if err != nil {
		return fmt.Errorf("invalid AWS credentials: %v", err)
	}

	return nil
}